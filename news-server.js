import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  startAfter
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCRQGhW7jSfY-PzGAMIYT-BgMJTxbUVCAM",
  authDomain: "neuraloverride-21338.firebaseapp.com",
  projectId: "neuraloverride-21338",
  storageBucket: "neuraloverride-21338.firebasestorage.app",
  messagingSenderId: "950397859511",
  appId: "1:950397859511:web:a31587d0fb1b8031453f32",
  measurementId: "G-ZTJMJ2CPX9"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore();
const newsContainer = document.getElementById("news-container");
const LOAD_LIMIT = 4;
let lastVisible = null;
let loading = false;

async function loadNews() {
  if (loading) return;
  loading = true;

  let q = query(
    collection(db, "news"),
    orderBy("createdAt", "desc"),
    limit(LOAD_LIMIT)
  );

  if (lastVisible) {
    q = query(
      collection(db, "news"),
      orderBy("createdAt", "desc"),
      startAfter(lastVisible),
      limit(LOAD_LIMIT)
    );
  }

  const snapshot = await getDocs(q);

  if (!snapshot.empty) {
    lastVisible = snapshot.docs[snapshot.docs.length - 1];

    snapshot.forEach(doc => {
      const data = doc.data();
      const div = document.createElement("div");
      div.classList.add("news-item");
      div.innerHTML = `
        <h3>${data.title}</h3>
        <p>${data.content}</p>
        <div class="news-date">
          ${data.createdAt ? new Date(data.createdAt.seconds * 1000).toLocaleDateString("de-DE") : "Unbekannt"}
        </div>
      `;
      newsContainer.appendChild(div);
    });
  }

  loading = false;
}

// Initial load
loadNews();

// Scroll-Event für Lazy Load
window.addEventListener("scroll", () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
    loadNews();
  }
});
