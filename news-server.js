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
  storageBucket: "neuraloverride-21338.firebaseapp.com",
  messagingSenderId: "950397859511",
  appId: "1:950397859511:web:a31587d0fb1b8031453f32",
  measurementId: "G-ZTJMJ2CPX9"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore();

const newsContainer = document.getElementById("news-container");
const spinner = document.getElementById("loading-spinner");
const LOAD_LIMIT = 4;
let lastVisible = null;
let loading = false;
let allLoaded = false;

async function loadNews() {
  if (loading || allLoaded) return;
  loading = true;
  spinner.style.display = "block";

  try {
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

    if (snapshot.empty) {
      allLoaded = true;
      const endMsg = document.createElement("p");
      endMsg.textContent = "You're up to date now. No further updates available.";
      endMsg.style.textAlign = "center";
      endMsg.style.marginTop = "var(--space-sm)";
      newsContainer.appendChild(endMsg);
    } else {
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
  } catch (error) {
    console.error("Fehler beim Laden der News:", error);
    const errMsg = document.createElement("p");
    errMsg.textContent = "Fehler beim Laden der News.";
    errMsg.style.color = "red";
    newsContainer.appendChild(errMsg);
  }

  spinner.style.display = "none";
  loading = false;
}

// Erstes Laden
loadNews();

// Lazy Loading bei Scroll
window.addEventListener("scroll", () => {
  if (
    window.innerHeight + window.scrollY >=
    document.body.offsetHeight - 100
  ) {
    loadNews();
  }
});
