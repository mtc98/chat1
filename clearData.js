// 清除 Firebase 舊資料的腳本 (userdojo, projects)
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

async function clearCollection(collectionName) {
  console.log(`\n正在清除 '${collectionName}' 集合...`);

  try {
    const snapshot = await db.collection(collectionName).get();

    if (snapshot.empty) {
      console.log(`✓ '${collectionName}' 集合已經是空的，無需處理。`);
      return;
    }

    console.log(`找到 ${snapshot.size} 筆文件，開始刪除...`);

    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    console.log(`✓ 成功刪除 '${collectionName}' 集合中的所有文件 (${snapshot.size} 筆)。`);

  } catch (error) {
    console.error(`✗ 清除 '${collectionName}' 集合時發生錯誤:`, error.message);
  }
}

async function clearAllData() {
  console.log('\n========== 開始清除 Firestore 資料 ==========');

  // 清除 userdojo 集合
  await clearCollection('userdojo');

  // 清除 projects 集合
  await clearCollection('projects');

  console.log('\n========== 所有指定集合已清除完畢！==========\n');
  process.exit(0);
}

clearAllData();
