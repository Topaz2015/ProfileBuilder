// Global variables
let products = []; // Stores all products

// 1. Load John Doe example
function loadExample() {
  document.getElementById("name").value = "John Doe";
  document.getElementById("description").value = "John Doe is a climate tech innovator...";

  document.getElementById("email").value = "john.doe@example.com";
  document.getElementById("phone").value = "+1234567890";
  document.getElementById("linkedin").value = "https://linkedin.com/in/johndoe"; // NEW
  document.getElementById("twitter").value = "https://twitter.com/johndoe";     // NEW
  document.getElementById("website").value = "https://johndoe.tech";           // NEW
  // Auto-fill example product
  document.getElementById("product-name").value = "Solar Charger Kit";
  document.getElementById("product-industry").value = "Climate";
  document.getElementById("product-desc").value = "A low-cost solar charger...";
  document.getElementById("product-price").value = "5000 Shs";
  document.getElementById("product-video").value = "https://youtube.com/example";
  document.getElementById("product-tags").value = "solar, renewable";
}

// 2. Add a product to the list
function addProduct() {
  const name = document.getElementById("product-name").value;
  const industry = document.getElementById("product-industry").value;
  const desc = document.getElementById("product-desc").value;
  const price = document.getElementById("product-price").value;
  const video = document.getElementById("product-video").value;
  const tags = document.getElementById("product-tags").value.split(",").map(tag => tag.trim());
  const image = document.getElementById("product-image").files[0];

  if (!name || !industry || !desc) {
    alert("Name, industry, and description are required!");
    return;
  }

  products.push({ name, industry, desc, price, video, tags, image });
  updateProductList();
  clearProductForm();
}

// 3. Update the displayed product list
function updateProductList() {
  const listDiv = document.getElementById("product-list");
  listDiv.innerHTML = "<h3>Your Products</h3>";

  products.forEach((product, index) => {
    listDiv.innerHTML += `
      <div class="product-item">
        <strong>${product.name}</strong> (${product.industry})<br>
        ${product.desc.slice(0, 100)}...<br>
        ${product.tags.length > 0 ? `Tags: ${product.tags.join(", ")}` : ""}
      </div>
    `;
  });
}

// 4. Clear the product form
function clearProductForm() {
  document.getElementById("product-name").value = "";
  document.getElementById("product-industry").value = "";
  document.getElementById("product-desc").value = "";
  document.getElementById("product-price").value = "";
  document.getElementById("product-video").value = "";
  document.getElementById("product-tags").value = "";
  document.getElementById("product-image").value = "";
}

// 5. Generate HTML files and ZIP
function generateFiles() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value; // NEW
  const phone = document.getElementById("phone").value; // NEW
  const linkedin = document.getElementById("linkedin").value;  // NEW
  const twitter = document.getElementById("twitter").value;    // NEW
  const website = document.getElementById("website").value;   // NEW
  const description = document.getElementById("description").value;
  const avatar = document.getElementById("avatar").files[0];

  if (!name || !description || products.length === 0) {
    alert("Profile name, description, and at least one product are required!");
    return;
  }

  const zip = new JSZip();
  const folder = zip.folder(`innovator_${name.replace(/ /g, "_")}`);

  // Generate profile.html
  folder.file("profile.html", `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${name}'s Profile</title>
      <style>body { font-family: Arial; max-width: 800px; margin: 0 auto; padding: 20px; }
        .contacts { margin: 15px 0; color: #555; }
        .social-links { margin-top: 10px; }
        .social-links a { 
          display: inline-block;
          margin-right: 15px;
          color: #2c82e0;
          text-decoration: none;
        }
        .social-icon { 
          width: 16px;
          height: 16px;
          vertical-align: middle;
          margin-right: 5px;
        }
      </style>
    </head>
    <body>
      <h1>${name}</h1>
      ${avatar ? `<img src="images/avatar.jpg" width="150">` : ""}
      
      <!-- NEW: Contacts Section -->
      <div class="contacts">
        ${email ? `<p>📧 ${email}</p>` : ""}
        ${phone ? `<p>📞 ${phone}</p>` : ""}
        
        <!-- Social Media Links -->
        <div class="social-links">
          ${website ? `<a href="${website}" target="_blank"><img src="https://cdn-icons-png.flaticon.com/512/1006/1006771.png" class="social-icon">Website</a>` : ""}
          ${linkedin ? `<a href="${linkedin}" target="_blank"><img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" class="social-icon">LinkedIn</a>` : ""}
          ${twitter ? `<a href="${twitter}" target="_blank"><img src="https://cdn-icons-png.flaticon.com/512/124/124021.png" class="social-icon">Twitter</a>` : ""}
        </div>
      </div>

      <p>${description.replace(/\n/g, "<br>")}</p>
      <h2>Products</h2>
      <ul>${products.map(p => `<li><a href="${p.name.replace(/ /g, "_")}.html">${p.name}</a></li>`).join("")}</ul>
    </body>
    </html>
  `);

  // Generate product pages
  products.forEach(product => {
    folder.file(`${product.name.replace(/ /g, "_")}.html`, `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${product.name}</title>
        <style>body { font-family: Arial; max-width: 800px; margin: 0 auto; padding: 20px; }</style>
      </head>
      <body>
        <h1>${product.name}</h1>
        <p><strong>Industry:</strong> ${product.industry}</p>
        ${product.image ? `<img src="images/${product.image.name}" width="300">` : ""}
        <p>${product.desc.replace(/\n/g, "<br>")}</p>
        ${product.price ? `<p><strong>Price:</strong> ${product.price}</p>` : ""}
        ${product.tags.length > 0 ? `<p><strong>Tags:</strong> ${product.tags.join(", ")}</p>` : ""}
        ${product.video ? `<iframe width="560" height="315" src="${embedVideoLink(product.video)}" frameborder="0" allowfullscreen></iframe>` : ""}
        <p><a href="profile.html">← Back to Profile</a></p>
      </body>
      </html>
    `);

    // Add images to ZIP
    if (product.image) {
      const imgFolder = folder.folder("images");
      imgFolder.file(product.image.name, product.image);
    }
  });

  // Add avatar to ZIP
  if (avatar) {
    const imgFolder = folder.folder("images");
    imgFolder.file("avatar.jpg", avatar);
  }

  // Download ZIP
  zip.generateAsync({ type: "blob" }).then(content => {
    saveAs(content, `innovator_${name.replace(/ /g, "_")}.zip`);
  });
}

// Helper: Convert YouTube URL to embed
function embedVideoLink(url) {
  if (url.includes("youtube.com")) {
    const videoId = url.split("v=")[1];
    return `https://www.youtube.com/embed/${videoId}`;
  }
  return url;
}


