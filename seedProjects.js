// 獨立建立範例 projects 資料的腳本
const firebase = require('firebase/app');
require('firebase/firestore');

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

// 範例 projects 資料
const sampleProjects = [
  {
    name: "網站重新設計專案",
    details: "將公司網站進行全面改版，提升使用者體驗和視覺設計",
    category: "design",
    dueDate: firebase.firestore.Timestamp.fromDate(new Date('2025-11-15')),
    assignedUsersList: [],
    createdBy: {
      displayName: "系統管理員",
      photoURL: "https://i.pravatar.cc/150?img=1",
      id: "system"
    },
    comments: [],
    createdAt: firebase.firestore.Timestamp.now()
  },
  {
    name: "行動應用開發",
    details: "開發 iOS 和 Android 原生應用程式，包含使用者認證和資料同步功能",
    category: "development",
    dueDate: firebase.firestore.Timestamp.fromDate(new Date('2025-12-31')),
    assignedUsersList: [],
    createdBy: {
      displayName: "系統管理員",
      photoURL: "https://i.pravatar.cc/150?img=1",
      id: "system"
    },
    comments: [],
    createdAt: firebase.firestore.Timestamp.now()
  },
  {
    name: "Q4 行銷活動",
    details: "第四季度社群媒體行銷活動策劃與執行，目標增加 30% 用戶互動率",
    category: "marketing",
    dueDate: firebase.firestore.Timestamp.fromDate(new Date('2025-12-01')),
    assignedUsersList: [],
    createdBy: {
      displayName: "系統管理員",
      photoURL: "https://i.pravatar.cc/150?img=1",
      id: "system"
    },
    comments: [],
    createdAt: firebase.firestore.Timestamp.now()
  },
  {
    name: "企業客戶開發計畫",
    details: "針對中大型企業的業務開發策略，預計接觸 50 家潛在客戶",
    category: "sales",
    dueDate: firebase.firestore.Timestamp.fromDate(new Date('2025-11-30')),
    assignedUsersList: [],
    createdBy: {
      displayName: "系統管理員",
      photoURL: "https://i.pravatar.cc/150?img=1",
      id: "system"
    },
    comments: [],
    createdAt: firebase.firestore.Timestamp.now()
  },
  {
    name: "API 整合與優化",
    details: "整合第三方 API 服務並優化現有 API 效能，減少回應時間 50%",
    category: "development",
    dueDate: firebase.firestore.Timestamp.fromDate(new Date('2025-10-25')),
    assignedUsersList: [],
    createdBy: {
      displayName: "系統管理員",
      photoURL: "https://i.pravatar.cc/150?img=1",
      id: "system"
    },
    comments: [],
    createdAt: firebase.firestore.Timestamp.now()
  }
];

async function seedProjects() {
  console.log('\n========== 開始建立範例 Projects ==========\n');

  try {
    // 為了讓資料更真實，我們從 'userdojo' 集合取得使用者
    const usersSnapshot = await db.collection('userdojo').get();
    const users = [];

    usersSnapshot.forEach(doc => {
      users.push({
        id: doc.id,
        displayName: doc.data().displayName,
        photoURL: doc.data().photoURL,
      });
    });

    if (users.length === 0) {
      console.warn('⚠ 警告：在 `userdojo` 集合中找不到任何使用者。');
      console.warn('         專案將會使用預設的「系統管理員」作為建立者。');
    } else {
      console.log(`找到 ${users.length} 位使用者，將用他們來建立專案。`);
    }

    // 建立 projects
    for (let i = 0; i < sampleProjects.length; i++) {
      const project = { ...sampleProjects[i] };

      // 如果有使用者，則輪流指派建立者，並隨機分配成員
      if (users.length > 0) {
        // 1. 輪流選擇一位使用者當作建立者
        const creator = users[i % users.length];
        project.createdBy = creator;

        // 2. 從剩下的使用者中，隨機指派 1-2 位成員
        const otherUsers = users.filter(u => u.id !== creator.id);
        const numToAssign = Math.min(Math.floor(Math.random() * 2) + 1, otherUsers.length);
        project.assignedUsersList = otherUsers.sort(() => 0.5 - Math.random()).slice(0, numToAssign);
      }

      const docRef = await db.collection('projects').add(project);
      console.log(`✓ 已建立專案：${project.name} (ID: ${docRef.id})`);
    }

    console.log('\n========== 所有範例 Projects 已建立完畢！==========\n');
    process.exit(0);
  } catch (error) {
    console.error('✗ 執行時發生錯誤:', error);
    process.exit(1);
  }
}

seedProjects();
