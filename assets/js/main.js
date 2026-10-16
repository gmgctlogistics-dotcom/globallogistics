/**
 * GLOBAL LOGISTICS - Main Application & UI Interactions
 * Vehicle Relocation & Auto Freight Network
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initStickyHeader();
  initRateEstimator();
  initTrackingWidget();
  initGalleryFilterAndLightbox();
  initFaqAccordion();
  initHubTabs();
  initQuoteForm();
  initFloatingTools();
  initSmoothScroll();
});

/* ==========================================================================
   1. MOBILE MENU DRAWER
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobileToggle');
  const drawer = document.getElementById('mobileDrawer');
  const overlay = document.getElementById('drawerOverlay');
  const closeBtn = document.getElementById('drawerClose');
  const navLinks = drawer ? drawer.querySelectorAll('a') : [];

  function openDrawer() {
    if (drawer && overlay) {
      drawer.classList.add('open');
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeDrawer() {
    if (drawer && overlay) {
      drawer.classList.remove('open');
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  if (toggleBtn) toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (overlay) overlay.addEventListener('click', closeDrawer);

  navLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });
}

/* ==========================================================================
   2. STICKY HEADER & SCROLL BEHAVIOR
   ========================================================================== */
function initStickyHeader() {
  const navbar = document.querySelector('.navbar-main');
  const backToTopBtn = document.getElementById('backToTopBtn');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;

    if (scrollPos > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }

    if (backToTopBtn) {
      if (scrollPos > 450) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  }, { passive: true });
}

/* ==========================================================================
   3. INTERACTIVE RATE & TRANSIT TIME CALCULATOR
   ========================================================================== */
const ROUTE_DISTANCES = {
  // Delhi
  'delhi-mumbai': { km: 1420, days: '3 - 4 Days' },
  'mumbai-delhi': { km: 1420, days: '3 - 4 Days' },
  'delhi-bangalore': { km: 2170, days: '4 - 5 Days' },
  'bangalore-delhi': { km: 2170, days: '4 - 5 Days' },
  'delhi-pune': { km: 1440, days: '3 - 4 Days' },
  'pune-delhi': { km: 1440, days: '3 - 4 Days' },
  'delhi-hyderabad': { km: 1580, days: '3 - 4 Days' },
  'hyderabad-delhi': { km: 1580, days: '3 - 4 Days' },
  'delhi-chennai': { km: 2200, days: '4 - 5 Days' },
  'chennai-delhi': { km: 2200, days: '4 - 5 Days' },
  'delhi-kolkata': { km: 1530, days: '3 - 4 Days' },
  'kolkata-delhi': { km: 1530, days: '3 - 4 Days' },
  'delhi-ahmedabad': { km: 940, days: '2 - 3 Days' },
  'ahmedabad-delhi': { km: 940, days: '2 - 3 Days' },

  // Mumbai
  'mumbai-bangalore': { km: 980, days: '2 - 3 Days' },
  'bangalore-mumbai': { km: 980, days: '2 - 3 Days' },
  'mumbai-pune': { km: 150, days: '24 Hours' },
  'pune-mumbai': { km: 150, days: '24 Hours' },
  'mumbai-hyderabad': { km: 710, days: '2 - 3 Days' },
  'hyderabad-mumbai': { km: 710, days: '2 - 3 Days' },
  'mumbai-chennai': { km: 1340, days: '3 - 4 Days' },
  'chennai-mumbai': { km: 1340, days: '3 - 4 Days' },
  'mumbai-kolkata': { km: 1960, days: '4 - 5 Days' },
  'kolkata-mumbai': { km: 1960, days: '4 - 5 Days' },
  'mumbai-ahmedabad': { km: 530, days: '1 - 2 Days' },
  'ahmedabad-mumbai': { km: 530, days: '1 - 2 Days' },

  // Bangalore
  'bangalore-pune': { km: 840, days: '2 - 3 Days' },
  'pune-bangalore': { km: 840, days: '2 - 3 Days' },
  'bangalore-hyderabad': { km: 570, days: '1 - 2 Days' },
  'hyderabad-bangalore': { km: 570, days: '1 - 2 Days' },
  'bangalore-chennai': { km: 350, days: '24 - 36 Hours' },
  'chennai-bangalore': { km: 350, days: '24 - 36 Hours' },
  'bangalore-kolkata': { km: 1870, days: '4 - 5 Days' },
  'kolkata-bangalore': { km: 1870, days: '4 - 5 Days' },
  'bangalore-ahmedabad': { km: 1500, days: '3 - 4 Days' },
  'ahmedabad-bangalore': { km: 1500, days: '3 - 4 Days' },

  // Pune
  'pune-hyderabad': { km: 560, days: '1 - 2 Days' },
  'hyderabad-pune': { km: 560, days: '1 - 2 Days' },
  'pune-chennai': { km: 1190, days: '3 - 4 Days' },
  'chennai-pune': { km: 1190, days: '3 - 4 Days' },
  'pune-kolkata': { km: 1830, days: '4 - 5 Days' },
  'kolkata-pune': { km: 1830, days: '4 - 5 Days' },
  'pune-ahmedabad': { km: 660, days: '1 - 2 Days' },
  'ahmedabad-pune': { km: 660, days: '1 - 2 Days' },

  // Hyderabad
  'hyderabad-chennai': { km: 630, days: '1 - 2 Days' },
  'chennai-hyderabad': { km: 630, days: '1 - 2 Days' },
  'hyderabad-kolkata': { km: 1500, days: '3 - 4 Days' },
  'kolkata-hyderabad': { km: 1500, days: '3 - 4 Days' },
  'hyderabad-ahmedabad': { km: 1220, days: '3 - 4 Days' },
  'ahmedabad-hyderabad': { km: 1220, days: '3 - 4 Days' },

  // Chennai
  'chennai-kolkata': { km: 1660, days: '3 - 4 Days' },
  'kolkata-chennai': { km: 1660, days: '3 - 4 Days' },
  'chennai-ahmedabad': { km: 1850, days: '4 - 5 Days' },
  'ahmedabad-chennai': { km: 1850, days: '4 - 5 Days' },

  // Kolkata
  'kolkata-ahmedabad': { km: 2070, days: '4 - 5 Days' },
  'ahmedabad-kolkata': { km: 2070, days: '4 - 5 Days' }
};

const VEHICLE_MULTIPLIERS = {
  'hatchback': 1.0,
  'sedan': 1.15,
  'suv': 1.35,
  'luxury': 1.65,
  'two-wheeler': 0.45
};

const CARRIER_MULTIPLIERS = {
  'open': 1.0,
  'enclosed': 1.35
};

// Rate slab calculation based on total round-trip (up & down) kilometers
function getPerKmRate(totalKm) {
  if (totalKm < 1000) {
    return 42; // Under 1000 KM Total: Rs. 42 per KM
  } else if (totalKm <= 3000) {
    return 37; // 1000 to 3000 KM Total: Rs. 37 per KM
  } else {
    return 35; // Above 3000 KM Total: Rs. 35 per KM
  }
}

function getSlabLabel(totalKm) {
  if (totalKm < 1000) {
    return 'Rate Slab: ₹42 / KM (< 1,000 KM)';
  } else if (totalKm <= 3000) {
    return 'Rate Slab: ₹37 / KM (1,000 – 3,000 KM)';
  } else {
    return 'Rate Slab: ₹35 / KM (> 3,000 KM)';
  }
}

function getTransitDaysEstimate(km) {
  if (km <= 300) return '24 Hours';
  if (km <= 700) return '1 - 2 Days';
  if (km <= 1200) return '2 - 3 Days';
  if (km <= 1800) return '3 - 4 Days';
  if (km <= 2500) return '4 - 5 Days';
  return '5 - 7 Days';
}

function calculateTransportTariff(oneWayKm, vehicleType = 'sedan', carrierType = 'open') {
  const totalKm = Math.round(oneWayKm * 2); // Both ways (Up & Down)
  const ratePerKm = getPerKmRate(totalKm);
  const vMult = VEHICLE_MULTIPLIERS[vehicleType] || 1.15;
  const cMult = CARRIER_MULTIPLIERS[carrierType] || 1.0;

  // Base price multiplied by vehicle class & carrier configuration
  const basePrice = Math.round(totalKm * ratePerKm * vMult * cMult);
  // 18% GST calculation (Goods Transport Agency standard)
  const gstAmount = Math.round(basePrice * 0.18);
  // Total estimate including GST and all Highway Tolls
  const totalEstimate = basePrice + gstAmount;

  return {
    oneWayKm,
    totalKm,
    ratePerKm,
    vMult,
    cMult,
    basePrice,
    gstAmount,
    totalEstimate,
    slabLabel: getSlabLabel(totalKm)
  };
}

function initRateEstimator() {
  // 1. Hero Quick Estimator
  const heroOrigin = document.getElementById('heroOrigin');
  const heroDest = document.getElementById('heroDest');
  const heroVehicle = document.getElementById('heroVehicle');
  const heroCustomKmWrap = document.getElementById('heroCustomKmWrap');
  const heroCustomKm = document.getElementById('heroCustomKm');
  const heroPriceDisplay = document.getElementById('heroPriceDisplay');
  const heroBreakdownDisplay = document.getElementById('heroBreakdownDisplay');
  const heroDaysDisplay = document.getElementById('heroDaysDisplay');
  const heroKmDisplay = document.getElementById('heroKmDisplay');
  const heroBookBtn = document.getElementById('heroBookBtn');

  function updateHeroEstimate() {
    if (!heroOrigin || !heroDest || !heroVehicle) return;
    const from = heroOrigin.value;
    const to = heroDest.value;
    const vType = heroVehicle.value;

    const isCustom = from === 'custom' || to === 'custom';
    if (heroCustomKmWrap) {
      heroCustomKmWrap.style.display = isCustom ? 'block' : 'none';
    }

    let oneWayKm = 1200;
    let days = '3 - 4 Days';

    if (isCustom) {
      oneWayKm = parseFloat(heroCustomKm?.value) || 1200;
      days = getTransitDaysEstimate(oneWayKm);
    } else {
      if (from === to) {
        if (heroPriceDisplay) heroPriceDisplay.textContent = 'Select Diff Cities';
        if (heroBreakdownDisplay) heroBreakdownDisplay.textContent = 'Pickup & delivery must differ';
        if (heroDaysDisplay) heroDaysDisplay.textContent = '--';
        if (heroKmDisplay) heroKmDisplay.textContent = 'Local shifting inspection';
        return;
      }

      const routeKey = `${from}-${to}`.toLowerCase();
      const route = ROUTE_DISTANCES[routeKey] || { km: 1200, days: '3 - 4 Days' };
      oneWayKm = route.km;
      days = route.days;
    }

    const tariff = calculateTransportTariff(oneWayKm, vType, 'open');

    if (heroPriceDisplay) {
      heroPriceDisplay.textContent = `₹${tariff.totalEstimate.toLocaleString('en-IN')}*`;
    }
    if (heroBreakdownDisplay) {
      heroBreakdownDisplay.textContent = `Base: ₹${tariff.basePrice.toLocaleString('en-IN')} + 18% GST: ₹${tariff.gstAmount.toLocaleString('en-IN')}`;
    }
    if (heroDaysDisplay) {
      heroDaysDisplay.textContent = `Est. Transit: ${days}`;
    }
    if (heroKmDisplay) {
      heroKmDisplay.textContent = `${tariff.totalKm.toLocaleString('en-IN')} Total KM @ ₹${tariff.ratePerKm}/KM`;
    }
  }

  [heroOrigin, heroDest, heroVehicle].forEach(el => {
    if (el) el.addEventListener('change', updateHeroEstimate);
  });
  if (heroCustomKm) {
    heroCustomKm.addEventListener('input', updateHeroEstimate);
  }
  updateHeroEstimate();

  if (heroBookBtn) {
    heroBookBtn.addEventListener('click', () => {
      const mainPickup = document.getElementById('quotePickup');
      const mainDrop = document.getElementById('quoteDrop');
      const quoteNotes = document.getElementById('quoteNotes');

      const from = heroOrigin.value;
      const to = heroDest.value;
      const isCustom = from === 'custom' || to === 'custom';
      const oneWayKm = isCustom ? (parseFloat(heroCustomKm?.value) || 1200) : (ROUTE_DISTANCES[`${from}-${to}`.toLowerCase()]?.km || 1200);
      const tariff = calculateTransportTariff(oneWayKm, heroVehicle.value, 'open');

      if (mainPickup && heroOrigin) {
        mainPickup.value = isCustom ? 'Custom Origin Hub' : heroOrigin.options[heroOrigin.selectedIndex].text;
      }
      if (mainDrop && heroDest) {
        mainDrop.value = isCustom ? 'Custom Destination Hub' : heroDest.options[heroDest.selectedIndex].text;
      }
      if (quoteNotes) {
        quoteNotes.value = `Instant Estimate: ₹${tariff.totalEstimate.toLocaleString('en-IN')} (One-Way: ${tariff.oneWayKm} KM, Up & Down: ${tariff.totalKm} KM @ ₹${tariff.ratePerKm}/KM + 18% GST: ₹${tariff.gstAmount.toLocaleString('en-IN')}. Fastag Tolls Included).`;
      }

      const quoteSection = document.getElementById('quote-section');
      if (quoteSection) {
        quoteSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // 2. Full Rate Calculator Section
  const calcOrigin = document.getElementById('calcOrigin');
  const calcDest = document.getElementById('calcDest');
  const calcVehicle = document.getElementById('calcVehicle');
  const calcCarrier = document.getElementById('calcCarrier');
  const calcCustomKmWrap = document.getElementById('calcCustomKmWrap');
  const calcCustomKm = document.getElementById('calcCustomKm');
  const summaryRouteName = document.getElementById('summaryRouteName');
  const summaryDistance = document.getElementById('summaryDistance');
  const summarySlabTag = document.getElementById('summarySlabTag');
  const summaryBaseFare = document.getElementById('summaryBaseFare');
  const summaryGst = document.getElementById('summaryGst');
  const summaryDays = document.getElementById('summaryDays');
  const summaryCost = document.getElementById('summaryCost');
  const calcBookBtn = document.getElementById('calcBookBtn');

  function updateMainCalculator() {
    if (!calcOrigin || !calcDest || !calcVehicle || !calcCarrier) return;

    const fromVal = calcOrigin.value;
    const toVal = calcDest.value;
    const fromText = calcOrigin.options[calcOrigin.selectedIndex]?.text || 'Delhi';
    const toText = calcDest.options[calcDest.selectedIndex]?.text || 'Mumbai';
    const vType = calcVehicle.value;
    const cType = calcCarrier.value;

    const isCustom = fromVal === 'custom' || toVal === 'custom';
    if (calcCustomKmWrap) {
      calcCustomKmWrap.style.display = isCustom ? 'block' : 'none';
    }

    let oneWayKm = 1200;
    let days = '3 - 4 Days';

    if (isCustom) {
      oneWayKm = parseFloat(calcCustomKm?.value) || 1200;
      days = getTransitDaysEstimate(oneWayKm);
    } else {
      if (fromVal === toVal) {
        if (summaryRouteName) summaryRouteName.textContent = 'Please choose different cities';
        if (summaryDistance) summaryDistance.textContent = 'Local intracity transport requires site survey inspection';
        if (summarySlabTag) summarySlabTag.textContent = 'Local Shifting Tariff';
        if (summaryBaseFare) summaryBaseFare.textContent = '₹4,500';
        if (summaryGst) summaryGst.textContent = '+ ₹810';
        if (summaryDays) summaryDays.textContent = 'Same Day';
        if (summaryCost) summaryCost.textContent = '₹5,310*';
        return;
      }

      const routeKey = `${fromVal}-${toVal}`.toLowerCase();
      const route = ROUTE_DISTANCES[routeKey] || { km: 1250, days: '3 - 4 Days' };
      oneWayKm = route.km;
      days = route.days;
    }

    const tariff = calculateTransportTariff(oneWayKm, vType, cType);

    if (summaryRouteName) {
      if (isCustom) {
        summaryRouteName.innerHTML = `Custom Route &bull; ${oneWayKm.toLocaleString('en-IN')} KM`;
      } else {
        summaryRouteName.innerHTML = `${fromText} &rarr; ${toText}`;
      }
    }
    if (summaryDistance) {
      summaryDistance.textContent = `One-Way: ~${tariff.oneWayKm.toLocaleString('en-IN')} KM • Up & Down (Both Ways): ~${tariff.totalKm.toLocaleString('en-IN')} KM`;
    }
    if (summarySlabTag) {
      summarySlabTag.textContent = tariff.slabLabel;
    }
    if (summaryBaseFare) {
      summaryBaseFare.textContent = `₹${tariff.basePrice.toLocaleString('en-IN')}`;
    }
    if (summaryGst) {
      summaryGst.textContent = `+ ₹${tariff.gstAmount.toLocaleString('en-IN')}`;
    }
    if (summaryDays) {
      summaryDays.textContent = days;
    }
    if (summaryCost) {
      summaryCost.textContent = `₹${tariff.totalEstimate.toLocaleString('en-IN')}*`;
    }
  }

  [calcOrigin, calcDest, calcVehicle, calcCarrier].forEach(el => {
    if (el) el.addEventListener('change', updateMainCalculator);
  });
  if (calcCustomKm) {
    calcCustomKm.addEventListener('input', updateMainCalculator);
  }
  updateMainCalculator();

  if (calcBookBtn) {
    calcBookBtn.addEventListener('click', () => {
      const mainPickup = document.getElementById('quotePickup');
      const mainDrop = document.getElementById('quoteDrop');
      const quoteNotes = document.getElementById('quoteNotes');

      const fromVal = calcOrigin.value;
      const toVal = calcDest.value;
      const isCustom = fromVal === 'custom' || toVal === 'custom';
      const oneWayKm = isCustom ? (parseFloat(calcCustomKm?.value) || 1200) : (ROUTE_DISTANCES[`${fromVal}-${toVal}`.toLowerCase()]?.km || 1250);
      const tariff = calculateTransportTariff(oneWayKm, calcVehicle.value, calcCarrier.value);

      if (mainPickup && calcOrigin) {
        mainPickup.value = isCustom ? 'Custom Pickup Hub' : calcOrigin.options[calcOrigin.selectedIndex].text;
      }
      if (mainDrop && calcDest) {
        mainDrop.value = isCustom ? 'Custom Delivery Hub' : calcDest.options[calcDest.selectedIndex].text;
      }
      if (quoteNotes) {
        quoteNotes.value = `Calculator Quote: ₹${tariff.totalEstimate.toLocaleString('en-IN')} (One-Way: ${tariff.oneWayKm} KM, Up & Down: ${tariff.totalKm} KM @ ₹${tariff.ratePerKm}/KM + 18% GST: ₹${tariff.gstAmount.toLocaleString('en-IN')}. Fastag Tolls Included). Carrier: ${calcCarrier.options[calcCarrier.selectedIndex].text}, Vehicle: ${calcVehicle.options[calcVehicle.selectedIndex].text}`;
      }

      const quoteSection = document.getElementById('quote-section');
      if (quoteSection) {
        quoteSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
}

/* ==========================================================================
   4. CONSIGNMENT TRACKING WIDGET (LIVE SIMULATOR)
   ========================================================================== */
const TRACKING_DATABASE = {
  'GL-80419': {
    id: 'GL-80419',
    vehicle: 'Hyundai Creta SX (White) - DL 01 AB 9942',
    origin: 'Gurugram Central Hub, NCR',
    destination: 'Whitefield Depot, Bengaluru',
    carrier: 'Hydraulic Auto Carrier #HR-55-AK-9201',
    driver: 'Rajinder Kumar (+91 98112-XXXXX)',
    currentCheckpoint: 'Pune Highway Tollway Plaza (GPS Active)',
    status: 'In Transit',
    step: 3,
    progressWidth: '68%',
    eta: 'Tomorrow, 4:30 PM',
    lastUpdate: 'Just now (Satellite GPS Telemetry Active)'
  },
  'GL-62190': {
    id: 'GL-62190',
    vehicle: 'Tata Harrier XZA+ - MH 02 CD 4481',
    origin: 'Bhiwandi Hub, Mumbai',
    destination: 'Noida Sector 63 Yard, NCR',
    carrier: 'Enclosed Container Carrier #MH-04-GL-1102',
    driver: 'Surendra Patil (+91 98200-XXXXX)',
    currentCheckpoint: 'Jaipur Bypass Bypass Hub',
    status: 'Out for Doorstep Handover',
    step: 4,
    progressWidth: '92%',
    eta: 'Today by 6:00 PM',
    lastUpdate: '15 mins ago'
  },
  'GL-94301': {
    id: 'GL-94301',
    vehicle: 'BMW 330Li M Sport - KA 05 MN 1234',
    origin: 'Electronic City, Bengaluru',
    destination: 'Banjara Hills, Hyderabad',
    carrier: 'Single Car Hydraulic Covered Carrier #KA-01-EE-4091',
    driver: 'K. Venkatesh (+91 99801-XXXXX)',
    currentCheckpoint: 'Kurnool Tollway Hub',
    status: 'In Transit (Zero-Scratch Escort)',
    step: 3,
    progressWidth: '75%',
    eta: 'Tonight, 9:00 PM',
    lastUpdate: '5 mins ago'
  }
};

function initTrackingWidget() {
  const trackInput = document.getElementById('trackingIdInput');
  const trackBtn = document.getElementById('trackingSubmitBtn');
  const sampleChips = document.querySelectorAll('.sample-chip');
  const trackResultBox = document.getElementById('trackingResultDetails');
  const progressBar = document.getElementById('trackProgressLine');
  const nodes = document.querySelectorAll('.milestone-node');

  function renderTracking(data) {
    if (!trackResultBox) return;

    if (progressBar) progressBar.style.width = data.progressWidth;

    nodes.forEach((node, index) => {
      const stepNum = index + 1;
      node.classList.remove('completed', 'active');
      if (stepNum < data.step) {
        node.classList.add('completed');
      } else if (stepNum === data.step) {
        node.classList.add('active');
      }
    });

    const statusBadge = document.getElementById('trackStatusText');
    const vehicleText = document.getElementById('trackVehicleText');
    const carrierText = document.getElementById('trackCarrierText');
    const locationText = document.getElementById('trackLocationText');
    const etaText = document.getElementById('trackEtaText');

    if (statusBadge) statusBadge.textContent = data.status;
    if (vehicleText) vehicleText.textContent = data.vehicle;
    if (carrierText) carrierText.textContent = `${data.carrier} | Pilot: ${data.driver}`;
    if (locationText) locationText.textContent = `${data.currentCheckpoint} (${data.lastUpdate})`;
    if (etaText) etaText.textContent = data.eta;
  }

  function handleTrackSearch() {
    const rawVal = trackInput ? trackInput.value.trim().toUpperCase() : '';
    if (!rawVal) {
      alert('Please enter a valid tracking consignment number (e.g. GL-80419)');
      return;
    }

    const found = TRACKING_DATABASE[rawVal];
    if (found) {
      renderTracking(found);
    } else {
      // Dynamic simulated result for any custom entered code
      const dynamicRecord = {
        id: rawVal,
        vehicle: `Consignment Vehicle (${rawVal})`,
        origin: 'Primary Regional Origin Depot',
        destination: 'Destination Doorstep Address',
        carrier: `Hydraulic Auto Carrier #GL-${Math.floor(1000 + Math.random() * 9000)}`,
        driver: 'Assigned Senior Fleet Pilot',
        currentCheckpoint: 'National Highway Express Corridor (Live GPS Signal)',
        status: 'In Transit - On Schedule',
        step: 3,
        progressWidth: '65%',
        eta: 'Estimated 48-72 Hours',
        lastUpdate: 'Live GPS Satellite Ping Just Now'
      };
      renderTracking(dynamicRecord);
    }
  }

  if (trackBtn) trackBtn.addEventListener('click', handleTrackSearch);
  if (trackInput) {
    trackInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleTrackSearch();
    });
  }

  sampleChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const code = chip.dataset.code;
      if (trackInput && code) {
        trackInput.value = code;
        handleTrackSearch();
      }
    });
  });

  // Track button in top navigation bar
  const navTrackBtn = document.getElementById('navTrackBtn');
  if (navTrackBtn) {
    navTrackBtn.addEventListener('click', () => {
      const trackingSec = document.getElementById('tracking-section');
      if (trackingSec) trackingSec.scrollIntoView({ behavior: 'smooth' });
    });
  }
}

/* ==========================================================================
   5. GALLERY FILTERS & LIGHTBOX VIEWER
   ========================================================================== */
function initGalleryFilterAndLightbox() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.dataset.filter;
      galleryItems.forEach(item => {
        const category = item.dataset.category;
        if (filterVal === 'all' || category === filterVal) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const title = item.querySelector('.gallery-caption-title')?.textContent || 'GLOBAL LOGISTICS Fleet';
      const tag = item.querySelector('.gallery-caption-tag')?.textContent || 'Vehicle Logistics';

      if (lightbox && lightboxImg && img) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        if (lightboxCaption) {
          lightboxCaption.textContent = `${title} — ${tag}`;
        }
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeLightbox() {
    if (lightbox) {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}

/* ==========================================================================
   6. FAQ ACCORDION
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    if (header) {
      header.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        // Close other items
        faqItems.forEach(other => other.classList.remove('active'));
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });
}

/* ==========================================================================
   7. CITY HUB TABS
   ========================================================================== */
const HUB_DATA = {
  mumbai: {
    city: 'Mumbai & Western Zone Depot',
    address: 'Warehouse Complex #14-B, Near Mankoli Flyover, Bhiwandi, Mumbai - 421302',
    phone: '+91 98201 54321 / 022-2890-XXXX',
    email: 'mumbai.hub@globallogistics.in',
    features: '50-Truck Fleet Parking, Hydraulic Ramp Loading Bay, 24/7 CCTV Security Yard'
  },
  delhi: {
    city: 'Delhi NCR & Northern Hub',
    address: 'Logistics Park, Kherki Daula, Near Toll Plaza, NH-48, Gurugram, NCR - 122004',
    phone: '+91 98112 54321 / 0124-459-XXXX',
    email: 'delhi.hub@globallogistics.in',
    features: 'Central Inspection Center, Covered Storage Shed, Inter-State Dispatch Terminal'
  },
  bangalore: {
    city: 'Bengaluru & South Hub',
    address: 'Plot 88, Electronic City Phase 2, Hosur Road, Bengaluru, Karnataka - 560100',
    phone: '+91 99801 54321 / 080-412-XXXX',
    email: 'bangalore.hub@globallogistics.in',
    features: 'Tech City Dedicated Receiving Bay, Luxury Car Container Berth, Direct EV Charging Bay'
  },
  hyderabad: {
    city: 'Hyderabad & Deccan Hub',
    address: 'Survey 210, Outer Ring Road Logistics Zone, Shamshabad, Hyderabad - 501218',
    phone: '+91 97011 54321 / 040-240-XXXX',
    email: 'hyderabad.hub@globallogistics.in',
    features: 'Express Transit Corridor Junction, Wheel-Locking Verification Station'
  },
  chennai: {
    city: 'Chennai Coastal & Auto Hub',
    address: 'Sriperumbudur Auto Cluster Park, Bangalore Highway, Chennai, Tamil Nadu - 602105',
    phone: '+91 94441 54321 / 044-271-XXXX',
    email: 'chennai.hub@globallogistics.in',
    features: 'OEM Dealership Transport Berth, Southern Express Multi-Car Staging Yard'
  },
  pune: {
    city: 'Pune Auto Hub',
    address: 'Chakan Industrial Logistics Corridor Phase 2, Chakan, Pune, Maharashtra - 410501',
    phone: '+91 98901 54321 / 020-672-XXXX',
    email: 'pune.hub@globallogistics.in',
    features: 'Auto Corridor Express Loading Deck, Covered Two-Wheeler Crate Bay'
  },
  kolkata: {
    city: 'Kolkata & Eastern Hub',
    address: 'NH-16 Kolkata-Delhi Expressway, Dankuni Industrial Complex, Hooghly - 712311',
    phone: '+91 98301 54321 / 033-266-XXXX',
    email: 'kolkata.hub@globallogistics.in',
    features: 'East India Gateway Depot, Long Haul Transshipment Yard'
  },
  ahmedabad: {
    city: 'Ahmedabad & Gujarat Hub',
    address: 'Sanand Industrial GIDC Logistics Park, Sanand-Viramgam Highway, Ahmedabad - 382170',
    phone: '+91 98791 54321 / 079-297-XXXX',
    email: 'ahmedabad.hub@globallogistics.in',
    features: 'Gujarat Multi-Deck Carrier Berth, Enclosed Car Protection Facility'
  }
};

function initHubTabs() {
  const tabBtns = document.querySelectorAll('.hub-tab-btn');
  const hubCityName = document.getElementById('hubCityName');
  const hubAddress = document.getElementById('hubAddress');
  const hubPhone = document.getElementById('hubPhone');
  const hubEmail = document.getElementById('hubEmail');
  const hubFeatures = document.getElementById('hubFeatures');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const hubKey = btn.dataset.hub;
      const data = HUB_DATA[hubKey] || HUB_DATA['mumbai'];

      if (hubCityName) hubCityName.textContent = data.city;
      if (hubAddress) hubAddress.textContent = data.address;
      if (hubPhone) {
        hubPhone.textContent = data.phone;
        hubPhone.href = `tel:${data.phone.split('/')[0].trim()}`;
      }
      if (hubEmail) {
        hubEmail.textContent = data.email;
        hubEmail.href = `mailto:${data.email}`;
      }
      if (hubFeatures) hubFeatures.textContent = data.features;
    });
  });
}

/* ==========================================================================
   8. COMPREHENSIVE QUOTE FORM & CONFIRMATION MODAL
   ========================================================================== */
function initQuoteForm() {
  const form = document.getElementById('comprehensiveQuoteForm');
  const modal = document.getElementById('quoteSuccessModal');
  const modalClose = document.getElementById('modalCloseBtn');
  const refCodeDisplay = document.getElementById('modalRefCode');
  const waConfirmBtn = document.getElementById('modalWaBtn');

  // Set min date for pickup date input to today
  const dateInput = document.getElementById('quoteDate');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('quoteName')?.value.trim();
      const phone = document.getElementById('quotePhone')?.value.trim();
      const email = document.getElementById('quoteEmail')?.value.trim();
      const pickup = document.getElementById('quotePickup')?.value.trim();
      const drop = document.getElementById('quoteDrop')?.value.trim();
      const vehicle = document.getElementById('quoteVehicleModel')?.value.trim();
      const condition = form.querySelector('input[name="quoteCondition"]:checked')?.value || 'Running Condition';
      const carrierType = form.querySelector('input[name="quoteCarrierType"]:checked')?.value || 'Open Carrier';
      const transportDate = document.getElementById('quoteDate')?.value;
      const notes = document.getElementById('quoteNotes')?.value.trim();

      // Simple phone validation (10 digits Indian)
      const phoneDigits = phone.replace(/\D/g, '');
      if (phoneDigits.length < 10) {
        alert('Please enter a valid 10-digit mobile number for dispatch updates.');
        return;
      }

      // Generate realistic booking reference code
      const randomId = Math.floor(1000 + Math.random() * 9000);
      const generatedCode = `GLQ-2026-${randomId}`;

      // Persist quote request in localStorage to ensure zero lost leads
      try {
        const quoteRecord = {
          refCode: generatedCode,
          timestamp: new Date().toISOString(),
          name,
          phone,
          email,
          pickup,
          drop,
          vehicle,
          condition,
          carrierType,
          transportDate,
          notes
        };
        const existing = JSON.parse(localStorage.getItem('gl_quotes_log') || '[]');
        existing.unshift(quoteRecord);
        localStorage.setItem('gl_quotes_log', JSON.stringify(existing.slice(0, 100)));
      } catch (storageErr) {
        console.warn('Quote storage skipped:', storageErr);
      }

      if (refCodeDisplay) {
        refCodeDisplay.textContent = generatedCode;
        refCodeDisplay.title = 'Click to copy reference code';
        refCodeDisplay.style.cursor = 'pointer';
        refCodeDisplay.onclick = () => {
          if (navigator.clipboard) {
            navigator.clipboard.writeText(generatedCode).then(() => {
              const orig = refCodeDisplay.textContent;
              refCodeDisplay.textContent = 'Copied to clipboard!';
              setTimeout(() => { refCodeDisplay.textContent = orig; }, 1500);
            });
          }
        };
      }

      // Prepare WhatsApp Direct Message Link
      if (waConfirmBtn) {
        const waText = encodeURIComponent(
          `Hello GLOBAL LOGISTICS, I requested a quote!\n\n` +
          `Ref Code: ${generatedCode}\n` +
          `Name: ${name}\n` +
          `From: ${pickup} to ${drop}\n` +
          `Vehicle: ${vehicle} (${condition})\n` +
          `Carrier: ${carrierType}\n` +
          `Date: ${transportDate}\n\n` +
          `Please provide the final quotation and slot availability.`
        );
        waConfirmBtn.href = `https://wa.me/919820154321?text=${waText}`;
      }

      // Show confirmation modal
      if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }

      // Reset form
      form.reset();
    });
  }

  function closeModal() {
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }
}

/* ==========================================================================
   9. FLOATING ACTION TOOLS
   ========================================================================== */
function initFloatingTools() {
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}

/* ==========================================================================
   10. SMOOTH SCROLLING
   ========================================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });
}
