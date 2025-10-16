// 建立範例 userdojo 和 projects 完整資料的腳本
const firebase = require('firebase/app');
require('firebase/firestore');
require('firebase/auth');
require('firebase/storage');

const firebaseConfig = {
  apiKey: "AIzaSyDSKgUwZ5b8ZNM_3MX36XOSwMi6IuXQGm8",
  authDomain: "mtc9820201216.firebaseapp.com",
  projectId: "mtc9820201216",
  storageBucket: "mtc9820201216.appspot.com",
  messagingSenderId: "356765302606",
  appId: "1:356765302606:web:22142c8f99b9abd6aea81f"
};

// 初始化 Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();
const auth = firebase.auth();

// 範例使用者資料
const sampleUsers = [
  {
    email: 'mtc@123.com',
    password: '123456',
    displayName: '大明',
    photoURL: 'https://i.pravatar.cc/150?img=12'
  },
  {
    email: 'test@123.com',
    password: '123456',
    displayName: '小華',
    photoURL: 'https://i.pravatar.cc/150?img=33'
  },
  {
    email: '123@123.com',
    password: '123456',
    displayName: '阿強',
    photoURL: 'https://i.pravatar.cc/150?img=68'
  }
];

// 範例 projects 資料模板
const projectTemplates = [
  {
    name: "電商平台開發",
    details: "開發一個全功能的電商平台，包含商品管理、購物車、金流串接等功能",
    category: "development",
    daysUntilDue: 45
  },
  {
    name: "品牌視覺設計",
    details: "為新產品線設計完整的品牌識別系統，包含 Logo、配色、字體等",
    category: "design",
    daysUntilDue: 30
  },
  {
    name: "數位行銷活動",
    details: "規劃並執行 Q4 社群媒體行銷活動，提升品牌知名度和用戶參與度",
    category: "marketing",
    daysUntilDue: 60
  }
];

async function createUsers() {
  console.log('\n========== 開始建立 userdojo 帳號 ==========\n');

  const createdUsers = [];

  for (let i = 0; i < sampleUsers.length; i++) {
    const user = sampleUsers[i];

    try {
      // 建立 Auth 帳號
      const userCredential = await auth.createUserWithEmailAndPassword(
        user.email,
        user.password
      );

      const uid = userCredential.user.uid;

      // 更新 displayName 和 photoURL
      await userCredential.user.updateProfile({
        displayName: user.displayName,
        photoURL: user.photoURL
      });

      // 在 Firestore 建立 userdojo 文件
      await db.collection('userdojo').doc(uid).set({
        displayName: user.displayName,
        photoURL: user.photoURL,
        email: user.email,
        online: false
      });

      console.log(`✓ 已建立使用者: ${user.displayName} (${user.email})`);

      createdUsers.push({
        id: uid,
        displayName: user.displayName,
        photoURL: user.photoURL,
        email: user.email
      });

      // 登出以便建立下一個使用者
      await auth.signOut();

    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        console.log(`⚠ 使用者已存在: ${user.email}，嘗試取得現有資料...`);

        // 登入現有帳號
        const userCredential = await auth.signInWithEmailAndPassword(
          user.email,
          user.password
        );

        const uid = userCredential.user.uid;

        // 更新 Firebase Auth 的 displayName 和 photoURL
        await userCredential.user.updateProfile({
          displayName: user.displayName,
          photoURL: user.photoURL
        });

        // 更新 Firestore 資料
        await db.collection('userdojo').doc(uid).set({
          displayName: user.displayName,
          photoURL: user.photoURL,
          email: user.email,
          online: false
        }, { merge: true });

        console.log(`✓ 已更新使用者: ${user.displayName} (${user.email})`);

        createdUsers.push({
          id: uid,
          displayName: user.displayName,
          photoURL: user.photoURL,
          email: user.email
        });

        await auth.signOut();
      } else {
        console.error(`✗ 建立/更新使用者失敗 (${user.email}):`, error.message);
      }
    }
  }

  return createdUsers;
}

async function createProjects(users) {
  console.log('\n========== 開始建立 Projects ==========\n');

  for (let i = 0; i < projectTemplates.length; i++) {
    const template = projectTemplates[i];

    // 1. 輪流選擇一位使用者當作建立者
    const creator = users[i % users.length];

    // 2. 從剩下的使用者中，隨機指派 1-2 位成員
    const otherUsers = users.filter(u => u.id !== creator.id);
    // 確保在使用者很少的情況下也能正常運作
    const numToAssign = Math.min(Math.floor(Math.random() * 2) + 1, otherUsers.length);
    // 隨機排序並選取
    const assignedUsersList = otherUsers
      .sort(() => 0.5 - Math.random())
      .slice(0, numToAssign)
      .map(u => ({
        id: u.id,
        displayName: u.displayName,
        photoURL: u.photoURL
      }));

    // 計算截止日期
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + template.daysUntilDue);

    const project = {
      name: template.name,
      details: template.details,
      category: template.category,
      dueDate: firebase.firestore.Timestamp.fromDate(dueDate),
      assignedUsersList: assignedUsersList,
      createdBy: {
        id: creator.id,
        displayName: creator.displayName,
        photoURL: creator.photoURL
      },
      comments: [],
      createdAt: firebase.firestore.Timestamp.now()
    };

    try {
      const docRef = await db.collection('projects').add(project);
      console.log(`✓ 已建立專案：${project.name}`);
      console.log(`  - 建立者：${creator.displayName}`);
      if (assignedUsersList.length > 0) {
        console.log(`  - 分配給：${assignedUsersList.map(u => u.displayName).join(', ')}`);
      } else {
        console.log(`  - 分配給：無`);
      }
      console.log(`  - ID：${docRef.id}\n`);
    } catch (error) {
      console.error(`✗ 建立專案失敗 (${template.name})：`, error.message);
    }
  }
}

async function seedData() {
  try {
    // 建立使用者
    const users = await createUsers();

    if (users.length === 0) {
      console.error('✗ 沒有成功建立或找到任何使用者，無法繼續建立 projects。');
      process.exit(1);
    }

    console.log(`\n✓ 成功建立/更新 ${users.length} 位使用者！`);

    // 建立專案
    await createProjects(users);

    console.log('\n========== 完成！所有範例資料已成功建立 ==========\n');
    process.exit(0);

  } catch (error) {
    console.error('✗ 執行過程中發生未預期的錯誤:', error);
    process.exit(1);
  }
}

seedData();
