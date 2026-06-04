# 🚀 Gowtham Kumar D — Full Stack Developer Portfolio

> Modern dark-theme portfolio built with HTML5 · CSS3 · JavaScript · PHP · MySQL

---

## ✨ Features

| Feature | Details |
|---|---|
| 🎨 Design | Dark theme with blue/purple gradients, glassmorphism cards |
| 💫 Animations | Scroll-triggered reveals, typing effect, particle canvas, orbit ring |
| 📱 Responsive | Mobile-first, tested across all breakpoints |
| 🌙 Theme Toggle | Dark / Light mode with localStorage persistence |
| ⚡ Performance | Minimal dependencies, deferred JS, optimized assets |
| 🔍 SEO | Meta tags, Open Graph, semantic HTML5 |
| 📬 Contact | PHP mail + MySQL storage + auto-reply |
| 🔒 Security | Input sanitisation, rate limiting, prepared statements |

---

## 📁 Project Structure

```
portfolio/
│
├── index.html              # Main HTML (single-page)
├── css/
│   └── style.css           # All styles (dark/light, responsive)
├── js/
│   └── script.js           # Interactions, animations, form handler
├── images/                 # Add your photo as images/profile.jpg
│   └── .gitkeep
├── backend/
│   └── contact.php         # Form handler (mail + DB)
├── database/
│   └── portfolio.sql       # Schema + seed data
├── resume/
│   └── resume.pdf          # ← Drop your CV here
└── README.md
```

---

## ⚙️ Setup

### 1. Static (no backend)
Simply open `index.html` in any browser — no server required for the frontend.

### 2. Full Stack (PHP + MySQL)

**Requirements:** PHP 8.0+, MySQL 5.7+ / MariaDB 10.4+, web server (Apache/Nginx)

#### Database
```sql
-- In MySQL/phpMyAdmin, run:
source database/portfolio.sql
```

#### Backend config
Open `backend/contact.php` and update the constants:
```php
define('DB_HOST', 'localhost');
define('DB_USER', 'your_mysql_username');
define('DB_PASS', 'your_mysql_password');
define('DB_NAME', 'portfolio_db');
define('OWNER_EMAIL', 'gowthamkumard6@gmail.com');
```

#### Serve
```bash
# Local dev with PHP built-in server
php -S localhost:8080

# Or place in Apache/Nginx web root
cp -r portfolio/ /var/www/html/
```

---

## 🖼️ Adding Your Photo

Replace the initials placeholder:
1. Add your photo as `images/profile.jpg` (recommended: 400×400px, square)
2. In `index.html`, replace the `.photo-placeholder` div with:
```html
<img src="images/profile.jpg" alt="Gowtham Kumar D" class="profile-photo" />
```
3. Add to `css/style.css`:
```css
.profile-photo {
  width: 100%; height: 100%; object-fit: cover; border-radius: 50%;
}
```

---

## 📄 Adding Your Resume

Drop your CV PDF as `resume/resume.pdf` — the download button links to it automatically.

---

## 🎨 Customisation

### Update Social Links
In `index.html`, search for `href="#"` under `.social-links` and replace with your actual URLs:
```html
<a href="https://linkedin.com/in/yourprofile" ...>
<a href="https://github.com/yourusername" ...>
<a href="https://instagram.com/yourhandle" ...>
```

### Color Theming
All colors are CSS variables in `:root` inside `css/style.css`:
```css
--clr-blue:   #3b82f6;
--clr-purple: #8b5cf6;
--grad-main:  linear-gradient(135deg, #3b82f6, #8b5cf6);
```

---

## 🌐 Deployment

### cPanel / Shared Hosting
1. Upload all files via File Manager or FTP
2. Import `database/portfolio.sql` via phpMyAdmin
3. Update DB credentials in `backend/contact.php`

### Vercel / Netlify (static only)
The frontend works perfectly on static hosts. Disable the PHP form or use a service like Formspree.

---

## 📜 License

Personal portfolio — © 2026 Gowtham Kumar D. All rights reserved.

---

*Crafted with ❤️ in Chennai, Tamil Nadu*
