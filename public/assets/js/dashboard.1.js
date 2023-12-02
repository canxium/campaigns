// =========================================================
// Soft UI Dashboard - v1.0.7
// =========================================================

// Product Page: https://www.creative-tim.com/product/soft-ui-dashboard
// Copyright 2023 Creative Tim (https://www.creative-tim.com)
// Licensed under MIT (https://github.com/creativetimofficial/soft-ui-dashboard/blob/main/LICENSE)

// Coded by www.creative-tim.com

// =========================================================

// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

"use strict";
(function() {
  let USDollar = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
  });

  
  Promise.all([
    getErc20Balance('Bd65D6efb2C3e6B4dD33C664643BEB8e5E133055', '0xdac17f958d2ee523a2206206994597c13d831ec7', 'https://rpc.ankr.com/eth').then(response => response.json()),
    getErc20Balance('Bd65D6efb2C3e6B4dD33C664643BEB8e5E133055', '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', 'https://rpc.ankr.com/eth').then(response => response.json()),
    getErc20Balance('Bd65D6efb2C3e6B4dD33C664643BEB8e5E133055', '0x55d398326f99059ff775485246999027b3197955', 'https://rpc.ankr.com/bsc').then(response => response.json()),
    getErc20Balance('Bd65D6efb2C3e6B4dD33C664643BEB8e5E133055', '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d', 'https://rpc.ankr.com/bsc').then(response => response.json()),
    getErc20Balance('Bd65D6efb2C3e6B4dD33C664643BEB8e5E133055', '0xc2132d05d31c914a87c6611c10748aeb04b58e8f', 'https://rpc.ankr.com/polygon').then(response => response.json()),
    getErc20Balance('Bd65D6efb2C3e6B4dD33C664643BEB8e5E133055', '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359', 'https://rpc.ankr.com/polygon').then(response => response.json()),
  ]).then(value => {
    const ethereum = (BigInt(value[0].result) + BigInt(value[1].result))/BigInt(1000000)
    const bsc = (BigInt(value[2].result) + BigInt(value[3].result))/BigInt("1000000000000000000")
    const polygon = (BigInt(value[4].result) + BigInt(value[5].result))/BigInt(1000000)
    const funds = BigInt(30012)
    document.getElementById("ethereum").textContent = USDollar.format(ethereum)
    document.getElementById("polygon").textContent = USDollar.format(polygon)
    document.getElementById("bsc").textContent = USDollar.format(bsc)
    document.getElementById("totalRaised").textContent = USDollar.format(ethereum + bsc + polygon + funds)
    document.getElementById("mexcRaised").textContent = USDollar.format(ethereum + bsc + polygon + funds)
    document.getElementById("mexcListingRaised").textContent = USDollar.format(ethereum + bsc + polygon + funds)
    document.getElementById("mexcPercent").textContent = (parseInt(ethereum + bsc + polygon + funds)*100/60000).toFixed(0) + "%"
    document.getElementById("raisedProgress").classList.add(`w-${(parseInt(ethereum + bsc + polygon + funds)*100/60000).toFixed(0)}`)
    document.getElementById("raisedProgress2").classList.add(`w-${(parseInt(ethereum + bsc + polygon + funds)*100/60000).toFixed(0)}`)

    console.log(((ethereum + bsc + polygon)/BigInt(600)).toString() + "%")
  });
})();

// Verify navbar blur on scroll
navbarBlurOnScroll('navbarBlur');


// initialization of Tooltips
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function(tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
})
// https://rpc.ankr.com/eth
function getErc20Balance(address, contract, url) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  var raw = JSON.stringify({
    "jsonrpc": "2.0",
    "method": "eth_call",
    "params": [
      {
        "from": "0x0000000000000000000000000000000000000000",
        "data": `0x70a08231000000000000000000000000${address}`,
        "to": contract
      },
      "latest"
    ],
    "id": 1
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  return fetch(url, requestOptions)
}

// Fixed Plugin

if (document.querySelector('.fixed-plugin')) {
  var fixedPlugin = document.querySelector('.fixed-plugin');
  var fixedPluginButton = document.querySelector('.fixed-plugin-button');
  var fixedPluginButtonNav = document.querySelector('.fixed-plugin-button-nav');
  var fixedPluginCard = document.querySelector('.fixed-plugin .card');
  var fixedPluginCloseButton = document.querySelectorAll('.fixed-plugin-close-button');
  var navbar = document.getElementById('navbarBlur');
  var buttonNavbarFixed = document.getElementById('navbarFixed');

  if (fixedPluginButton) {
    fixedPluginButton.onclick = function() {
      if (!fixedPlugin.classList.contains('show')) {
        fixedPlugin.classList.add('show');
      } else {
        fixedPlugin.classList.remove('show');
      }
    }
  }

  if (fixedPluginButtonNav) {
    fixedPluginButtonNav.onclick = function() {
      if (!fixedPlugin.classList.contains('show')) {
        fixedPlugin.classList.add('show');
      } else {
        fixedPlugin.classList.remove('show');
      }
    }
  }

  fixedPluginCloseButton.forEach(function(el) {
    el.onclick = function() {
      fixedPlugin.classList.remove('show');
    }
  })

  document.querySelector('body').onclick = function(e) {
    if (e.target != fixedPluginButton && e.target != fixedPluginButtonNav && e.target.closest('.fixed-plugin .card') != fixedPluginCard) {
      fixedPlugin.classList.remove('show');
    }
  }

  if (navbar) {
    if (navbar.getAttribute('navbar-scroll') == 'true') {
      buttonNavbarFixed.setAttribute("checked", "true");
    }
  }

}

// Tabs navigation

var total = document.querySelectorAll('.nav-pills');

total.forEach(function(item, i) {
  var moving_div = document.createElement('div');
  var first_li = item.querySelector('li:first-child .nav-link');
  var tab = first_li.cloneNode();
  tab.innerHTML = "-";

  moving_div.classList.add('moving-tab', 'position-absolute', 'nav-link');
  moving_div.appendChild(tab);
  item.appendChild(moving_div);

  var list_length = item.getElementsByTagName("li").length;

  moving_div.style.padding = '0px';
  moving_div.style.width = item.querySelector('li:nth-child(1)').offsetWidth + 'px';
  moving_div.style.transform = 'translate3d(0px, 0px, 0px)';
  moving_div.style.transition = '.5s ease';

  item.onmouseover = function(event) {
    let target = getEventTarget(event);
    let li = target.closest('li'); // get reference
    if (li) {
      let nodes = Array.from(li.closest('ul').children); // get array
      let index = nodes.indexOf(li) + 1;
      item.querySelector('li:nth-child(' + index + ') .nav-link').onclick = function() {
        moving_div = item.querySelector('.moving-tab');
        let sum = 0;
        if (item.classList.contains('flex-column')) {
          for (var j = 1; j <= nodes.indexOf(li); j++) {
            sum += item.querySelector('li:nth-child(' + j + ')').offsetHeight;
          }
          moving_div.style.transform = 'translate3d(0px,' + sum + 'px, 0px)';
          moving_div.style.height = item.querySelector('li:nth-child(' + j + ')').offsetHeight;
        } else {
          for (var j = 1; j <= nodes.indexOf(li); j++) {
            sum += item.querySelector('li:nth-child(' + j + ')').offsetWidth;
          }
          moving_div.style.transform = 'translate3d(' + sum + 'px, 0px, 0px)';
          moving_div.style.width = item.querySelector('li:nth-child(' + index + ')').offsetWidth + 'px';
        }
      }
    }
  }
});


// Tabs navigation resize

window.addEventListener('resize', function(event) {
  total.forEach(function(item, i) {
    item.querySelector('.moving-tab').remove();
    var moving_div = document.createElement('div');
    var tab = item.querySelector(".nav-link.active").cloneNode();
    tab.innerHTML = "-";

    moving_div.classList.add('moving-tab', 'position-absolute', 'nav-link');
    moving_div.appendChild(tab);

    item.appendChild(moving_div);

    moving_div.style.padding = '0px';
    moving_div.style.transition = '.5s ease';

    let li = item.querySelector(".nav-link.active").parentElement;

    if (li) {
      let nodes = Array.from(li.closest('ul').children); // get array
      let index = nodes.indexOf(li) + 1;

      let sum = 0;
      if (item.classList.contains('flex-column')) {
        for (var j = 1; j <= nodes.indexOf(li); j++) {
          sum += item.querySelector('li:nth-child(' + j + ')').offsetHeight;
        }
        moving_div.style.transform = 'translate3d(0px,' + sum + 'px, 0px)';
        moving_div.style.width = item.querySelector('li:nth-child(' + index + ')').offsetWidth + 'px';
        moving_div.style.height = item.querySelector('li:nth-child(' + j + ')').offsetHeight;
      } else {
        for (var j = 1; j <= nodes.indexOf(li); j++) {
          sum += item.querySelector('li:nth-child(' + j + ')').offsetWidth;
        }
        moving_div.style.transform = 'translate3d(' + sum + 'px, 0px, 0px)';
        moving_div.style.width = item.querySelector('li:nth-child(' + index + ')').offsetWidth + 'px';

      }
    }
  });

  if (window.innerWidth < 991) {
    total.forEach(function(item, i) {
      if (!item.classList.contains('flex-column')) {
        item.classList.add('flex-column', 'on-resize');
      }
    });
  } else {
    total.forEach(function(item, i) {
      if (item.classList.contains('on-resize')) {
        item.classList.remove('flex-column', 'on-resize');
      }
    })
  }
});


function getEventTarget(e) {
  e = e || window.event;
  return e.target || e.srcElement;
}

// End tabs navigation


//Set Sidebar Color
function sidebarColor(a) {
  var parent = a.parentElement.children;
  var color = a.getAttribute("data-color");

  for (var i = 0; i < parent.length; i++) {
    parent[i].classList.remove('active');
  }

  if (!a.classList.contains('active')) {
    a.classList.add('active');
  } else {
    a.classList.remove('active');
  }

  var sidebar = document.querySelector('.sidenav');
  sidebar.setAttribute("data-color", color);

  if (document.querySelector('#sidenavCard')) {
    var sidenavCard = document.querySelector('#sidenavCard');
    let sidenavCardClasses = ['card', 'card-background', 'shadow-none', 'card-background-mask-' + color];
    sidenavCard.className = '';
    sidenavCard.classList.add(...sidenavCardClasses);

    var sidenavCardIcon = document.querySelector('#sidenavCardIcon');
    let sidenavCardIconClasses = ['ni', 'ni-diamond', 'text-gradient', 'text-lg', 'top-0', 'text-' + color];
    sidenavCardIcon.className = '';
    sidenavCardIcon.classList.add(...sidenavCardIconClasses);
  }

}

// Set Navbar Fixed
function navbarFixed(el) {
  let classes = ['position-sticky', 'blur', 'shadow-blur', 'mt-4', 'left-auto', 'top-1', 'z-index-sticky'];
  const navbar = document.getElementById('navbarBlur');

  if (!el.getAttribute("checked")) {
    navbar.classList.add(...classes);
    navbar.setAttribute('navbar-scroll', 'true');
    navbarBlurOnScroll('navbarBlur');
    el.setAttribute("checked", "true");
  } else {
    navbar.classList.remove(...classes);
    navbar.setAttribute('navbar-scroll', 'false');
    navbarBlurOnScroll('navbarBlur');
    el.removeAttribute("checked");
  }
};

// Navbar blur on scroll

function navbarBlurOnScroll(id) {
  const navbar = document.getElementById(id);
  let navbarScrollActive = navbar ? navbar.getAttribute("navbar-scroll") : false;
  let scrollDistance = 5;
  let classes = ['position-sticky', 'blur', 'shadow-blur', 'mt-4', 'left-auto', 'top-1', 'z-index-sticky'];
  let toggleClasses = ['shadow-none'];

  if (navbarScrollActive == 'true') {
    window.onscroll = debounce(function() {
      if (window.scrollY > scrollDistance) {
        blurNavbar();
      } else {
        transparentNavbar();
      }
    }, 10);
  } else {
    window.onscroll = debounce(function() {
      transparentNavbar();
    }, 10);
  }

  function blurNavbar() {
    navbar.classList.add(...classes)
    navbar.classList.remove(...toggleClasses)

    toggleNavLinksColor('blur');
  }

  function transparentNavbar() {
    if (navbar) {
      navbar.classList.remove(...classes)
      navbar.classList.add(...toggleClasses)

      toggleNavLinksColor('transparent');
    }
  }

  function toggleNavLinksColor(type) {
    let navLinks = document.querySelectorAll('.navbar-main .nav-link')
    let navLinksToggler = document.querySelectorAll('.navbar-main .sidenav-toggler-line')

    if (type === "blur") {
      navLinks.forEach(element => {
        element.classList.remove('text-body')
      });

      navLinksToggler.forEach(element => {
        element.classList.add('bg-dark')
      });
    } else if (type === "transparent") {
      navLinks.forEach(element => {
        element.classList.add('text-body')
      });

      navLinksToggler.forEach(element => {
        element.classList.remove('bg-dark')
      });
    }
  }
}


// Debounce Function
// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this,
      args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

//Set Sidebar Type
function sidebarType(a) {
  var parent = a.parentElement.children;
  var color = a.getAttribute("data-class");

  var colors = [];

  for (var i = 0; i < parent.length; i++) {
    parent[i].classList.remove('active');
    colors.push(parent[i].getAttribute('data-class'));
  }

  if (!a.classList.contains('active')) {
    a.classList.add('active');
  } else {
    a.classList.remove('active');
  }

  var sidebar = document.querySelector('.sidenav');

  for (var i = 0; i < colors.length; i++) {
    sidebar.classList.remove(colors[i]);
  }

  sidebar.classList.add(color);
}


// Toggle Sidenav
const iconNavbarSidenav = document.getElementById('iconNavbarSidenav');
const iconSidenav = document.getElementById('iconSidenav');
const sidenav = document.getElementById('sidenav-main');
let body = document.getElementsByTagName('body')[0];
let className = 'g-sidenav-pinned';

if (iconNavbarSidenav) {
  iconNavbarSidenav.addEventListener("click", toggleSidenav);
}

if (iconSidenav) {
  iconSidenav.addEventListener("click", toggleSidenav);
}

function toggleSidenav() {
  if (body.classList.contains(className)) {
    body.classList.remove(className);
    setTimeout(function() {
      sidenav.classList.remove('bg-white');
    }, 100);
    sidenav.classList.remove('bg-transparent');

  } else {
    body.classList.add(className);
    sidenav.classList.add('bg-white');
    sidenav.classList.remove('bg-transparent');
    iconSidenav.classList.remove('d-none');
  }
}

// Resize navbar color depends on configurator active type of sidenav

let referenceButtons = document.querySelector('[data-class]');

// Deactivate sidenav type buttons on resize and small screens
window.addEventListener("resize", sidenavTypeOnResize);
window.addEventListener("load", sidenavTypeOnResize);

function sidenavTypeOnResize() {
  let elements = document.querySelectorAll('[onclick="sidebarType(this)"]');
  if (window.innerWidth < 1200) {
    elements.forEach(function(el) {
      el.classList.add('disabled');
    });
  } else {
    elements.forEach(function(el) {
      el.classList.remove('disabled');
    });
  }
}