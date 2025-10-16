// 清除 Firebase 舊資料的腳本 (userdojo, projects)
require('dotenv').config(); // 讀取 .env 檔案
const firebase = require('firebase/app');
require('firebase/firestore');

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
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
