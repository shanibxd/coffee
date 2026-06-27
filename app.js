/* ==========================================
   Coffee Brown - Interactive JavaScript Logic
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. Page Preloader
  // ==========================================
  const loader = document.getElementById('loader');
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
          loader.style.display = 'none';
        }, 800);
      }, 600);
    });
  }

  // ==========================================
  // 2. Rising Steam Particle Background (Canvas)
  // ==========================================
  const canvas = document.getElementById('particle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    const particleCount = 35;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class SteamParticle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + Math.random() * 80;
        this.size = Math.random() * 12 + 6; // Bigger, cloud-like puffs
        this.speedY = -(Math.random() * 0.8 + 0.4);
        this.speedX = (Math.random() * 0.6 - 0.3);
        this.opacity = 0;
        this.fadeSpeed = Math.random() * 0.004 + 0.002;
        this.maxOpacity = Math.random() * 0.25 + 0.05; // Soft steam translucent look
        this.growing = true;
      }

      update() {
        this.y += this.speedY;
        this.x += this.speedX;

        if (this.growing) {
          this.opacity += this.fadeSpeed;
          if (this.opacity >= this.maxOpacity) this.growing = false;
        } else {
          this.opacity -= this.fadeSpeed * 0.8; // fade out slightly slower
        }

        // Reset if offscreen or fully faded
        if (this.y < -30 || (this.opacity <= 0 && !this.growing) || this.x < -30 || this.x > canvas.width + 30) {
          this.reset();
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        // Soft grayish-brown warm steam color
        ctx.fillStyle = `rgba(235, 225, 215, ${this.opacity})`;
        ctx.shadowBlur = this.size * 1.5;
        ctx.shadowColor = 'rgba(235, 225, 215, 0.2)';
        ctx.fill();
      }
    }

    const initParticles = () => {
      for (let i = 0; i < particleCount; i++) {
        const p = new SteamParticle();
        p.y = Math.random() * canvas.height; // spread initially
        particles.push(p);
      }
    };

    const animateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.shadowBlur = 0;
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animateParticles);
    };

    initParticles();
    animateParticles();
  }

  // ==========================================
  // 3. Navigation Scrolling Interactions
  // ==========================================
  const header = document.querySelector('.main-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile Hamburger Toggle
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // Active Link Highlight
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  const scrollActiveLinkUpdate = () => {
    let currentId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (window.pageYOffset >= sectionTop - 150) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  };
  window.addEventListener('scroll', scrollActiveLinkUpdate);

  // ==========================================
  // 4. Scroll Reveal Animations
  // ==========================================
  const revealElements = document.querySelectorAll('.scroll-reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ==========================================
  // 5. Menu Filter Category Tabs
  // ==========================================
  const tabBtns = document.querySelectorAll('.menu-tab-btn');
  const menuCards = document.querySelectorAll('.menu-card');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-category');

      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      menuCards.forEach(card => {
        if (card.getAttribute('data-category') === category) {
          card.classList.remove('hidden');
          card.style.opacity = 0;
          setTimeout(() => card.style.opacity = 1, 50);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // ==========================================
  // 6. Online Order Cart Logic
  // ==========================================
  let cart = [];

  const cartDrawer = document.getElementById('cart-drawer');
  const cartOverlay = document.getElementById('cart-drawer-overlay');
  const btnCloseCart = document.getElementById('btn-close-cart');
  const btnOpenCartNav = document.getElementById('btn-nav-cart');
  const btnOpenCartHero = document.getElementById('hero-btn-order');
  const cartBadge = document.getElementById('cart-count-badge');
  const cartItemsContainer = document.getElementById('cart-items-container');
  const cartEmptyMsg = document.getElementById('cart-empty-msg');
  const cartSubtotal = document.getElementById('cart-subtotal-price');
  // Confirm Online Order Checkout Form Trigger
  const cartContentWrapper = document.getElementById('cart-content-wrapper');
  const cartCheckoutContainer = document.getElementById('cart-checkout-container');
  const btnBackToCart = document.getElementById('btn-back-to-cart');
  const cartCheckoutForm = document.getElementById('cart-checkout-form');
  const btnSubmitOrderFinal = document.getElementById('btn-submit-order-final');

  // Toggle Drawer
  const openCart = () => {
    cartDrawer.classList.add('active');
    cartOverlay.classList.add('active');
    
    // Reset display to cart item list on open
    if (cartContentWrapper && cartCheckoutContainer) {
      cartContentWrapper.classList.remove('hidden');
      cartCheckoutContainer.classList.add('hidden');
    }
    renderCart();
  };

  const closeCart = () => {
    cartDrawer.classList.remove('active');
    cartOverlay.classList.remove('active');
  };

  if (btnOpenCartNav) btnOpenCartNav.addEventListener('click', openCart);
  if (btnOpenCartHero) btnOpenCartHero.addEventListener('click', openCart);
  if (btnCloseCart) btnCloseCart.addEventListener('click', closeCart);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

  // Add Item to Cart
  const addToCart = (name, price) => {
    const existing = cart.find(item => item.name === name);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ name, price, qty: 1 });
    }
    updateCartCount();
    showToast(`Added ${name} to order.`);
    openCart();
  };

  // Wire up Menu "Add to Order" buttons
  const addCartButtons = document.querySelectorAll('.btn-add-cart');
  addCartButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.getAttribute('data-name');
      const price = parseFloat(btn.getAttribute('data-price'));
      addToCart(name, price);
    });
  });

  const updateCartCount = () => {
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    cartBadge.textContent = totalQty;
  };

  // Render Drawer list
  const renderCart = () => {
    // Clear dynamic list
    const items = cartItemsContainer.querySelectorAll('.cart-item');
    items.forEach(el => el.remove());

    if (cart.length === 0) {
      cartEmptyMsg.style.display = 'block';
      cartSubtotal.textContent = '₹0';
      btnCheckout.style.pointerEvents = 'none';
      btnCheckout.style.opacity = '0.5';
    } else {
      cartEmptyMsg.style.display = 'none';
      btnCheckout.style.pointerEvents = 'auto';
      btnCheckout.style.opacity = '1';

      let subtotalVal = 0;

      cart.forEach((item, index) => {
        subtotalVal += item.price * item.qty;

        const cartItemEl = document.createElement('div');
        cartItemEl.className = 'cart-item';
        cartItemEl.innerHTML = `
          <div class="cart-item-details">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-price">₹${item.price} each</div>
          </div>
          <div class="cart-item-qty-control">
            <button class="btn-qty btn-minus" data-index="${index}">&minus;</button>
            <span class="qty-display">${item.qty}</span>
            <button class="btn-qty btn-plus" data-index="${index}">&plus;</button>
          </div>
        `;

        cartItemsContainer.appendChild(cartItemEl);
      });

      cartSubtotal.textContent = `₹${subtotalVal}`;

      // Quantity change handlers
      cartItemsContainer.querySelectorAll('.btn-minus').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.getAttribute('data-index'));
          if (cart[idx].qty > 1) {
            cart[idx].qty -= 1;
          } else {
            cart.splice(idx, 1);
          }
          updateCartCount();
          renderCart();
        });
      });

      cartItemsContainer.querySelectorAll('.btn-plus').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.getAttribute('data-index'));
          cart[idx].qty += 1;
          updateCartCount();
          renderCart();
        });
      });
    }
  };

  // Confirm Online Order Checkout
  if (btnCheckout) {
    btnCheckout.addEventListener('click', () => {
      btnCheckout.textContent = 'Processing Order...';
      btnCheckout.style.pointerEvents = 'none';

      setTimeout(() => {
        showToast('Order confirmed! Our kitchen is preparing your selections.');
        cart = [];
        updateCartCount();
        closeCart();
        btnCheckout.textContent = 'Confirm Online Order';
        btnCheckout.style.pointerEvents = 'auto';
      }, 1500);
    });
  }

  // ==========================================
  // 7. Interactive Brew Customizer Logic
  // ==========================================
  const customizerPrice = document.getElementById('customizer-total-price');
  const recipeText = document.getElementById('recipe-text');
  const optionCards = document.querySelectorAll('.option-card');
  const optionCardsMulti = document.querySelectorAll('.option-card-multi');
  
  const liquidBase = document.getElementById('liquid-base');
  const liquidMilk = document.getElementById('liquid-milk');
  const liquidSweetener = document.getElementById('liquid-sweetener');
  const topCardamom = document.getElementById('liquid-topping-cardamom');
  const topGinger = document.getElementById('liquid-topping-ginger');
  const topCloves = document.getElementById('liquid-topping-cloves');

  // Initial customizer state
  let config = {
    bean: { name: 'Assam CTC Tea', price: 35.00 },
    milk: { name: 'Whole Milk', price: 5.00, color: '#fdfaee', ratio: 25 },
    sweetener: { name: 'Desi Jaggery', price: 5.00, color: '#caa45a', ratio: 6 },
    toppings: {}
  };

  // Option selection logic (Single-Select)
  optionCards.forEach(card => {
    card.addEventListener('click', () => {
      const type = card.getAttribute('data-type');
      const val = card.getAttribute('data-value');
      const price = parseFloat(card.getAttribute('data-price'));

      document.querySelectorAll(`.option-card[data-type="${type}"]`).forEach(sibling => {
        sibling.classList.remove('active');
      });

      card.classList.add('active');

      config[type].name = val;
      config[type].price = price;

      if (type === 'milk') {
        config.milk.color = card.getAttribute('data-color');
        config.milk.ratio = parseInt(card.getAttribute('data-ratio'));
      } else if (type === 'sweetener') {
        config.sweetener.color = card.getAttribute('data-color');
        config.sweetener.ratio = parseInt(card.getAttribute('data-ratio'));
      }

      updateBrewVisuals();
    });
  });

  // Topping Toggle logic (Multi-Select)
  optionCardsMulti.forEach(card => {
    card.addEventListener('click', () => {
      const val = card.getAttribute('data-value');
      const price = parseFloat(card.getAttribute('data-price'));
      const id = card.getAttribute('id');

      card.classList.toggle('active');

      if (card.classList.contains('active')) {
        config.toppings[id] = { name: val, price: price };
      } else {
        delete config.toppings[id];
      }

      updateBrewVisuals();
    });
  });

  const updateBrewVisuals = () => {
    // 1. Calculate price
    let total = config.bean.price + config.milk.price + config.sweetener.price;
    Object.keys(config.toppings).forEach(key => {
      total += config.toppings[key].price;
    });

    customizerPrice.textContent = `₹${total.toFixed(2)}`;

    // 2. Recipe text compile
    let toppingsList = Object.values(config.toppings).map(t => t.name).join(', ');
    let recipeStr = `${config.bean.name}`;
    if (config.milk.name !== 'None (Black)') recipeStr += `, ${config.milk.name}`;
    if (config.sweetener.name !== 'None' && config.sweetener.name !== 'Sugar') recipeStr += `, ${config.sweetener.name}`;
    if (toppingsList) recipeStr += ` + [${toppingsList}]`;
    recipeText.textContent = recipeStr;

    // 3. Dynamic Cup styling updates
    let baseHeight = 80;
    if (config.milk.name === 'None (Black)') {
      baseHeight = 90;
    }
    liquidBase.style.height = `${baseHeight}%`;

    // Swap liquid base colors
    if (config.bean.name === 'Chikmagalur Coffee') {
      liquidBase.style.backgroundColor = '#3e271b'; // Dark coffee
    } else if (config.bean.name === 'Darjeeling Green') {
      liquidBase.style.backgroundColor = '#a5c45c'; // Green tea tint
    } else {
      liquidBase.style.backgroundColor = '#633d2a'; // Assam tea brown
    }

    // Set milk height & color
    liquidMilk.style.height = `${config.milk.ratio}%`;
    liquidMilk.style.backgroundColor = config.milk.color;

    // Set sweetener height & color
    liquidSweetener.style.height = `${config.sweetener.ratio}%`;
    liquidSweetener.style.backgroundColor = config.sweetener.color;

    // Set spices opacity overlay
    topCardamom.style.opacity = config.toppings['top-cardamom'] ? '0.9' : '0';
    topGinger.style.opacity = config.toppings['top-ginger'] ? '0.9' : '0';
    topCloves.style.opacity = config.toppings['top-cloves'] ? '0.9' : '0';
  };

  // Order Custom Brew add-to-cart
  const btnOrder = document.getElementById('btn-order-brew');
  if (btnOrder) {
    btnOrder.addEventListener('click', () => {
      // Calculate total
      let price = config.bean.price + config.milk.price + config.sweetener.price;
      Object.keys(config.toppings).forEach(key => {
        price += config.toppings[key].price;
      });

      let spicesStr = Object.values(config.toppings).map(t => t.name.split(' (')[0]).join('/');
      let customItemName = `Custom ${config.bean.name.split(' ')[1] || config.bean.name}`;
      if (spicesStr) customItemName += ` (${spicesStr})`;

      addToCart(customItemName, price);
    });
  }

  // Run initial calculations
  updateBrewVisuals();

  // ==========================================
  // 8. Custom Toast Notification System
  // ==========================================
  const toastContainer = document.getElementById('toast-container');

  const showToast = (message) => {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <div class="toast-gold-dot"></div>
      <span>${message}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('show');
    }, 50);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        toast.remove();
      }, 400);
    }, 3500);
  };

  // ==========================================
  // 9. Newsletter Form Submit
  // ==========================================
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('newsletter-email').value;
      showToast(`Subscribed successfully: Welcome ${email}`);
      newsletterForm.reset();
    });
  }
});
