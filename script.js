document.addEventListener("DOMContentLoaded", () => {
  
  // --- 0. Custom Cyber Cursor ---
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorOutline = document.querySelector('.cursor-outline');
  let cursorX = window.innerWidth / 2;
  let cursorY = window.innerHeight / 2;
  let outlineX = cursorX;
  let outlineY = cursorY;

  window.addEventListener('mousemove', (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
    if (cursorDot) {
      cursorDot.style.left = `${cursorX}px`;
      cursorDot.style.top = `${cursorY}px`;
    }
  });

  function animateCursor() {
    outlineX += (cursorX - outlineX) * 0.15;
    outlineY += (cursorY - outlineY) * 0.15;
    if (cursorOutline) {
      cursorOutline.style.left = `${outlineX}px`;
      cursorOutline.style.top = `${outlineY}px`;
    }
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Cursor hover state
  const addHoverEffects = () => {
    const interactives = document.querySelectorAll('a, button, input, textarea, .bento-card, .tree-node, [onclick], .cert-item');
    interactives.forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  };
  addHoverEffects();


  // --- 0.5 Vanilla Tilt 3D Effect ---
  if (typeof VanillaTilt !== 'undefined') {
    VanillaTilt.init(document.querySelectorAll(".bento-card"), {
      max: 5,
      speed: 400,
      glare: true,
      "max-glare": 0.1,
      scale: 1.01
    });
  }

  // --- 1. Theme Toggle ---
  const themeToggle = document.getElementById('themeToggle');
  const htmlTag = document.documentElement;
  const savedTheme = localStorage.getItem('irfanPortfolioTheme');
  
  function setTheme(theme) {
    htmlTag.setAttribute('data-theme', theme);
    themeToggle.innerHTML = theme === 'dark' ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
    localStorage.setItem('irfanPortfolioTheme', theme);
  }
  
  setTheme(savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  
  themeToggle.addEventListener('click', () => {
    const currentTheme = htmlTag.getAttribute('data-theme');
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
  });

  // --- 2. Navbar Scroll Effect ---
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  });

  // --- 3. GSAP Animations (Premium Smooth Reveals) ---
  gsap.registerPlugin(ScrollTrigger);

  // Fade Up
  gsap.utils.toArray('.reveal-fade').forEach(element => {
    gsap.fromTo(element, 
      { opacity: 0, y: 30 },
      {
        scrollTrigger: { trigger: element, start: "top 85%", toggleActions: "play none none reverse" },
        opacity: 1, y: 0, duration: 0.8, ease: "power2.out"
      }
    );
  });

  // Slide Up
  gsap.utils.toArray('.reveal-slide').forEach(element => {
    gsap.fromTo(element, 
      { opacity: 0, y: 50 },
      {
        scrollTrigger: { trigger: element, start: "top 85%", toggleActions: "play none none reverse" },
        opacity: 1, y: 0, duration: 0.8, ease: "power3.out"
      }
    );
  });

  // --- 4. Premium Card Glow Effect & 3D Tilt ---
  document.querySelectorAll('.bento-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
      
      // 3D Tilt (only on desktop)
      if (window.innerWidth > 900) {
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -3; // subtle 3 deg
        const rotateY = ((x - centerX) / centerX) * 3;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
      }
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });

  // --- 5. Back to Top Button ---
  const backToTop = document.getElementById('backToTop');
  if(backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) { backToTop.classList.add('show'); }
      else { backToTop.classList.remove('show'); }
    });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- 6. Typewriter Effect ---
  const textArray = ["Cloud Computing", "Cybersecurity", "IT Support", "Network Defense"];
  let textIndex = 0; let charIndex = 0; let isDeleting = false;
  const typeTarget = document.getElementById("typewriter");
  
  function typeEffect() {
    const currentWord = textArray[textIndex];
    if (isDeleting) {
      typeTarget.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typeTarget.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
    }
    
    let typeSpeed = isDeleting ? 40 : 80;
    if (!isDeleting && charIndex === currentWord.length) {
      typeSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % textArray.length;
      typeSpeed = 500;
    }
    setTimeout(typeEffect, typeSpeed);
  }
  if(typeTarget) { typeTarget.textContent = ""; setTimeout(typeEffect, 1000); }


  // --- 11. Boot Screen Logic ---
  const bootScreen = document.getElementById('boot-screen');
  if(bootScreen) {
    const biosDateEl = document.getElementById('biosDate');
    if(biosDateEl) {
      const now = new Date();
      const formattedDate = ("0" + (now.getMonth() + 1)).slice(-2) + '/' + ("0" + now.getDate()).slice(-2) + '/' + now.getFullYear().toString().slice(-2);
      const formattedTime = ("0" + now.getHours()).slice(-2) + ':' + ("0" + now.getMinutes()).slice(-2) + ':' + ("0" + now.getSeconds()).slice(-2);
      biosDateEl.innerText = `BIOS Date ${formattedDate} ${formattedTime} Ver 08.00.15`;
    }

    // Check if we've already booted in this session to avoid annoyance
    if(!sessionStorage.getItem('booted')) {
      const bootLines = document.querySelectorAll('.boot-line');
      bootLines.forEach(line => {
        const delay = line.getAttribute('data-delay');
        setTimeout(() => {
          line.style.opacity = '1';
        }, delay);
      });
      
      // Hide boot screen after 3 seconds total
      setTimeout(() => {
        bootScreen.classList.add('hidden');
        sessionStorage.setItem('booted', 'true');
      }, 3000);
    } else {
      bootScreen.style.display = 'none';
    }
  }

  // --- 13. Secure Transmission Form ---
  const secureForm = document.getElementById('secureContactForm');
  const encStatus = document.getElementById('encryptionStatus');
  const hashDisplay = document.getElementById('hashDisplay');
  const statusText = document.getElementById('encryptionStatusText');

  if(secureForm) {
    secureForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const formData = new FormData(secureForm);
      
      secureForm.style.display = 'none';
      encStatus.classList.remove('hidden');
      
      let interval = setInterval(() => {
        const hash = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        hashDisplay.innerText = hash.toUpperCase();
      }, 50);

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      })
      .then(async (response) => {
        let json = await response.json();
        // Maintain the 2.5s minimum animation for the 'hacker' effect
        setTimeout(() => {
          clearInterval(interval);
          if (response.status == 200) {
            statusText.innerText = "Payload Encrypted & Sent Successfully.";
            statusText.style.color = "var(--success)";
            document.querySelector('.hacker-loader').style.display = 'none';
            hashDisplay.innerText = "CONNECTION SECURED & TERMINATED.";
          } else {
            statusText.innerText = "Transmission Failed: " + (json.message || "Unknown error");
            statusText.style.color = "#ef4444";
            document.querySelector('.hacker-loader').style.display = 'none';
            hashDisplay.innerText = "ERROR ENCOUNTERED.";
          }
        }, 2500);
      })
      .catch(error => {
        setTimeout(() => {
          clearInterval(interval);
          statusText.innerText = "Transmission Intercepted (Network Error).";
          statusText.style.color = "#ef4444";
          document.querySelector('.hacker-loader').style.display = 'none';
          hashDisplay.innerText = "ERROR ENCOUNTERED.";
        }, 2500);
      });
    });
  }

  // --- Initialize GPA Calculator ---
  const subjectList = document.getElementById('subjectList');
  if(subjectList && subjectList.children.length === 0) {
    addSubject();
    addSubject();
  }
});

// --- 5. Interactive Tools: GPA Calculator ---
function addSubject() {
  const div = document.createElement('div');
  div.style.display = 'grid';
  div.style.gridTemplateColumns = '2fr 1fr 1fr auto';
  div.style.gap = '10px';
  div.style.alignItems = 'center';
  div.style.animation = 'fadeUp 0.3s ease-out forwards';
  
  div.innerHTML = `
    <input type="text" value="New Subject" style="padding: 10px; border-radius: 8px; border: 1px solid var(--card-border); background: var(--card-bg); color: var(--text-main); width: 100%;">
    <select class="grade-select" style="padding: 10px; border-radius: 8px; border: 1px solid var(--card-border); background: var(--card-bg); color: var(--text-main); width: 100%;">
      <option value="4.0">A</option>
      <option value="3.7">A-</option>
      <option value="3.3">B+</option>
      <option value="3.0">B</option>
      <option value="2.7">B-</option>
      <option value="2.3">C+</option>
      <option value="2.0">C</option>
      <option value="1.0">D</option>
      <option value="0.0">F</option>
    </select>
    <input type="number" class="credit-input" value="3" step="1" min="1" style="padding: 10px; border-radius: 8px; border: 1px solid var(--card-border); background: var(--card-bg); color: var(--text-main); width: 100%;">
    <button onclick="this.parentElement.remove()" style="padding: 10px; border-radius: 8px; border: 1px solid #ef4444; background: rgba(239, 68, 68, 0.1); color: #ef4444; cursor: pointer;"><i class="fa-solid fa-trash"></i></button>
  `;
  document.getElementById('subjectList').appendChild(div);
}

function calculateGPA() {
  const subjects = document.querySelectorAll('#subjectList > div');
  let totalPoints = 0, totalCredits = 0;
  
  subjects.forEach(s => {
    const grade = parseFloat(s.querySelector('.grade-select').value);
    const credits = parseFloat(s.querySelector('.credit-input').value);
    if (!isNaN(grade) && !isNaN(credits) && credits > 0) {
      totalPoints += grade * credits;
      totalCredits += credits;
    }
  });
  
  const resBox = document.getElementById('gpaResultBox');
  const gpaText = document.getElementById('finalGpaText');
  const badgeText = document.getElementById('gpaBadgeText');
  
  resBox.style.display = 'block';
  resBox.style.animation = 'none';
  resBox.offsetHeight; /* trigger reflow */
  resBox.style.animation = 'fadeUp 0.4s ease-out forwards';
  
  if (totalCredits === 0) {
    gpaText.innerText = "0.00";
    gpaText.style.color = "var(--text-muted)";
    badgeText.innerText = "Add valid subjects";
    badgeText.style.background = "rgba(100,116,139,0.2)";
    badgeText.style.color = "#94a3b8";
  } else {
    const gpa = (totalPoints / totalCredits).toFixed(2);
    gpaText.innerText = gpa;
    
    if (gpa >= 3.5) {
      gpaText.style.color = "#22c55e"; // Green
      badgeText.innerText = "🏆 Dean's List Target!";
      badgeText.style.background = "rgba(34, 197, 94, 0.1)";
      badgeText.style.color = "#22c55e";
    } else if (gpa >= 3.0) {
      gpaText.style.color = "var(--brand)"; // Blue
      badgeText.innerText = "✅ Good Standing";
      badgeText.style.background = "rgba(56, 189, 248, 0.1)";
      badgeText.style.color = "var(--brand)";
    } else if (gpa >= 2.0) {
      gpaText.style.color = "#eab308"; // Yellow
      badgeText.innerText = "⚠️ Needs Improvement";
      badgeText.style.background = "rgba(234, 179, 8, 0.1)";
      badgeText.style.color = "#eab308";
    } else {
      gpaText.style.color = "#ef4444"; // Red
      badgeText.innerText = "❌ Academic Probation Risk";
      badgeText.style.background = "rgba(239, 68, 68, 0.1)";
      badgeText.style.color = "#ef4444";
    }
  }
}

function resetSubjects() {
  document.getElementById('subjectList').innerHTML = '';
  document.getElementById('gpaResultBox').style.display = 'none';
  addSubject();
  addSubject();
}

// Initial populate
if(document.getElementById('subjectList')) {
  resetSubjects();
}

// --- 5. Interactive Tools: Phishing Scanner ---
function checkPhishing() {
  const url = document.getElementById('urlInput').value.trim();
  const loader = document.getElementById('scanLoader');
  const resultBox = document.getElementById('phishingResultBox');
  const threatLevelBox = document.getElementById('threatLevelBox');
  const threatIconBox = document.getElementById('threatIconBox');
  const threatIcon = document.getElementById('threatIcon');
  const threatText = document.getElementById('threatText');
  const breakdownList = document.getElementById('threatBreakdown');
  
  // Hide results, show loader
  resultBox.style.display = 'none';
  if (!url) return;
  
  loader.style.display = 'flex';
  
  // Simulate network delay
  setTimeout(() => {
    loader.style.display = 'none';
    resultBox.style.display = 'block';
    resultBox.style.animation = 'fadeUp 0.3s ease-out forwards';
    
    let score = 0, checks = [];
    const lower = url.toLowerCase();
    
    // Check HTTPS
    if (!lower.startsWith('https://')) { 
      score+=25; checks.push({text: 'Missing HTTPS encryption', pass: false}); 
    } else {
      checks.push({text: 'HTTPS protocol detected', pass: true});
    }
    
    // Check IP
    if (/\d+\.\d+\.\d+\.\d+/.test(url)) { 
      score+=35; checks.push({text: 'Raw IP address used instead of domain', pass: false}); 
    }
    
    // Check subdomains
    if ((lower.match(/\./g)||[]).length > 3) { 
      score+=20; checks.push({text: 'Excessive subdomains detected', pass: false}); 
    }
    
    // Check Keywords
    let foundKw = [];
    ['login','verify','secure','account','update','confirm','paypal','banking','signin','password'].forEach(k => { 
      if (lower.includes(k)) { score+=12; foundKw.push(k); } 
    });
    if (foundKw.length > 0) {
      checks.push({text: `Suspicious keywords found: '${foundKw.join(', ')}'`, pass: false});
    } else {
      checks.push({text: 'No suspicious keywords in URL', pass: true});
    }
    
    // TLDs
    let foundTld = null;
    ['.tk','.ml','.ga','.cf','.xyz','.top','.club','.live','.stream'].forEach(t => { 
      if (lower.includes(t)) { score+=18; foundTld = t; } 
    });
    if (foundTld) { checks.push({text: `High-risk TLD detected: ${foundTld}`, pass: false}); }
    
    // Evaluate Score
    if (score >= 60) {
      threatText.innerText = `MALICIOUS (${score} Risk Score)`;
      threatText.style.color = '#ef4444';
      threatIconBox.style.background = '#ef4444';
      threatIcon.className = 'fa-solid fa-skull-crossbones';
    } else if (score >= 25) {
      threatText.innerText = `SUSPICIOUS (${score} Risk Score)`;
      threatText.style.color = '#eab308';
      threatIconBox.style.background = '#eab308';
      threatIcon.className = 'fa-solid fa-triangle-exclamation';
    } else {
      threatText.innerText = `SAFE (${score} Risk Score)`;
      threatText.style.color = '#22c55e';
      threatIconBox.style.background = '#22c55e';
      threatIcon.className = 'fa-solid fa-shield-check';
    }
    
    // Populate Breakdown
    breakdownList.innerHTML = checks.map(c => `
      <li style="display: flex; gap: 10px; align-items: start;">
        <i class="fa-solid ${c.pass ? 'fa-check text-success' : 'fa-xmark text-danger'}" style="margin-top: 3px;"></i>
        <span>${c.text}</span>
      </li>
    `).join('');
    
  }, 1500); // 1.5s simulated scan time
}

// --- 12. Image Lightbox Modal ---
function openLightbox(src) {
  const lightbox = document.getElementById('imageLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  if(lightbox && lightboxImg) {
    lightboxImg.src = src;
    lightbox.classList.remove('hidden');
  }
}

function closeLightbox() {
  const lightbox = document.getElementById('imageLightbox');
  if(lightbox) {
    lightbox.classList.add('hidden');
  }
}

// Close lightbox when clicking outside the image
document.addEventListener('DOMContentLoaded', () => {
  const lightbox = document.getElementById('imageLightbox');
  if(lightbox) {
    lightbox.addEventListener('click', (e) => {
      if(e.target === lightbox) {
        closeLightbox();
      }
    });
  }
});

// --- 14. Hacker Mode Easter Egg ---
const secretCode = ['h', 'a', 'c', 'k'];
let secretIndex = 0;

document.addEventListener('keydown', (e) => {
  // Ignore if user is typing inside an input field
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

  if (e.key.toLowerCase() === secretCode[secretIndex]) {
    secretIndex++;
    if (secretIndex === secretCode.length) {
      document.body.classList.toggle('hacker-mode');
      secretIndex = 0; // reset
    }
  } else {
    secretIndex = 0; // reset if wrong key
  }
});

// --- 15. Download V-Card ---
function downloadVCard() {
  const vcard = `BEGIN:VCARD
VERSION:3.0
FN:Muhammad Irfan Bin Rizal
N:Rizal;Muhammad Irfan;;;
TITLE:Cloud & IT Professional
EMAIL;TYPE=INTERNET:Irfanizzani46@gmail.com
URL:https://irfanrizal.com
NOTE:Bachelor of Technology in Cloud Computing & Application (Hons) at UTeM. AWS Academy Graduate & Cisco Cybersecurity Pathway achiever.
END:VCARD`;

  const blob = new Blob([vcard], { type: 'text/vcard' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = 'Irfan_Rizal_Contact.vcf';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
