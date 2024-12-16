document.addEventListener("DOMContentLoaded", function() {});
const BASE_URL = "http://localhost:3000/books";
const currentUser = { id: 1, username: "pouros" }; // Example logged-in user

document.addEventListener("DOMContentLoaded", () => {
  const bookList = document.getElementById("list");
  const showPanel = document.getElementById("show-panel");

  // Fetch books and display their titles
  fetch(BASE_URL)
    .then((response) => response.json())
    .then((books) => {
      books.forEach((book) => {
        const li = document.createElement("li");
        li.textContent = book.title;
        li.addEventListener("click", () => showBookDetails(book));
        bookList.appendChild(li);
      });
    });

  // Show book details
  function showBookDetails(book) {
    showPanel.innerHTML = `
      <img src="${book.img_url}" alt="${book.title}">
      <h3>${book.title}</h3>
      <p>${book.description}</p>
      <ul>
        ${book.users.map((user) => `<li>${user.username}</li>`).join("")}
      </ul>
      <button>${isBookLikedByUser(book) ? "UNLIKE" : "LIKE"}</button>
    `;

    const likeButton = showPanel.querySelector("button");
    likeButton.addEventListener("click", () => toggleLike(book));
  }

  // Toggle like/unlike
  function toggleLike(book) {
    const isLiked = isBookLikedByUser(book);
    const updatedUsers = isLiked
      ? book.users.filter((user) => user.id !== currentUser.id)
      : [...book.users, currentUser];

    fetch(`${BASE_URL}/${book.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ users: updatedUsers }),
    })
      .then((response) => response.json())
      .then((updatedBook) => {
        showBookDetails(updatedBook);
      });
  }

  // Check if the book is liked by the current user
  function isBookLikedByUser(book) {
    return book.users.some((user) => user.id === currentUser.id);
  }
});
