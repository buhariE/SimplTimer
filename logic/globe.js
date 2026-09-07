/* ============================================================
   Interactive dot-matrix globe background.

   Replaces the old static wallpaper. Land is drawn as a grid of
   dots on an orthographic sphere; when a timezone is picked in
   the world clock, every dot sharing that zone's UTC offset is
   tinted and a marker pulses at that zone's city.

   Driven from logic/main.js via window.Globe.setZones().
   ============================================================ */
(function () {
    'use strict';

    var DEG = Math.PI / 180;

    /* --- Coarse world landmass, as [lon, lat] polygons ------------------
       Stylised, not survey-grade: enough fidelity to read as Earth at dot
       resolution. WATER shapes are subtracted from LAND. */

    var LAND = [
        /* eurasia */ [[-9.5,36],[-9,43],[-1.5,43.5],[-1.5,46],[-4.5,48.5],[0,49.5],[4,52],[7,53.5],[9,54],[8,57],[11,59],[15,62],[18,63],[21,65],[24,66],[21,69],[28,70],[33,71],[41,69],[44,67],[52,70],[60,71],[69,73],[74,73],[80,74],[90,76],[101,78],[105,77],[113,74],[129,73],[140,73],[146,72],[152,70],[159,70],[170,69],[179,69],[179,65],[170,61],[163,59],[160,55],[156,51],[151,59],[142,54],[142,46],[135,44],[131,43],[129,35],[126,34],[122,30],[121,22],[110,21],[108,11],[105,9],[103,1],[100,6],[98,8],[98,13],[94,16],[90,22],[87,21],[80,15],[77,8],[73,17],[70,21],[65,25],[61,25],[57,25],[52,29],[48,31],[44,37],[40,41],[36,41],[29,41],[26,40],[23,40],[19,40],[16,38],[13,45],[8,44],[3,43],[-2,36],[-9.5,36]],
        /* arabia */ [[34,28],[36,30],[40,31],[44,30],[48,30],[56,26],[59,22],[53,17],[45,13],[43,13],[39,21],[34,28]],
        /* britain */ [[-5,50],[-3,50.5],[0.5,50.8],[1.7,52.6],[0,53.4],[-1,54.6],[-1.5,56],[-2,57.6],[-4,58.6],[-5.5,57.5],[-3.2,55.5],[-4.7,54.2],[-3,51.8],[-5,50]],
        /* italy */ [[7,44],[10,46],[13.5,46.5],[13.5,45.4],[12.3,44.8],[14.2,42],[16,41.4],[18.5,40.4],[16,38.7],[15.6,38],[14.9,38.4],[12,41.4],[10,42.9],[8,44.3],[7,44]],
        /* ireland */ [[-10,51.5],[-10,55],[-6,55],[-6,51.5],[-10,51.5]],
        /* japan */ [[130,31],[129.5,33.5],[133,35.5],[137,37.5],[140,38.5],[139.5,41],[141,41.5],[140,42.5],[142,45.5],[145.5,44],[145,42.5],[142,40],[142,37],[139,35],[136,34],[133,33.5],[131,32],[130,31]],
        /* borneo_sulawesi */ [[109,2],[117,7],[119,1],[122,-1],[125,1],[122,-5],[117,-4],[110,-3],[109,2]],
        /* sumatra */ [[95,5],[99,3],[106,-6],[102,-5],[95,5]],
        /* java */ [[105,-6],[114,-7],[114,-8.5],[105,-7.5],[105,-6]],
        /* philippines */ [[120,13],[122,18],[125,10],[126,6],[122,7],[120,13]],
        /* newguinea */ [[131,-1],[141,-2],[150,-6],[147,-9],[140,-8],[133,-4],[131,-1]],
        /* sri_lanka */ [[79.6,6],[82,7],[81.5,9.8],[79.8,8.5],[79.6,6]],
        /* africa */ [[-17,14],[-17,21],[-13,27],[-10,31],[-6,35],[0,36],[10,34],[11,33],[20,32],[25,32],[30,31],[34,28],[36,22],[38,18],[43,12],[48,12],[51,11],[46,3],[42,-1],[40,-6],[40,-11],[36,-18],[35,-21],[33,-26],[28,-33],[22,-34],[18,-34],[15,-27],[12,-18],[9,-1],[2,5],[-4,5],[-8,4],[-13,8],[-16,12],[-17,14]],
        /* madagascar */ [[43,-12],[50,-15],[48,-25],[44,-22],[43,-12]],
        /* n_america */ [[-168,65],[-166,68],[-160,70],[-156,71],[-141,71],[-128,71],[-115,71],[-105,70],[-95,70],[-90,69],[-85,68],[-81,73],[-75,68],[-68,60],[-64,60],[-56,51],[-60,47],[-66,45],[-70,42],[-74,39],[-76,35],[-81,31],[-80,25],[-84,30],[-89,29],[-94,29],[-97,26],[-97,21],[-91,19],[-88,21],[-87,16],[-84,10],[-78,8],[-83,8],[-86,12],[-92,15],[-96,16],[-105,20],[-110,24],[-114,28],[-117,32],[-120,34],[-124,40],[-124,48],[-131,53],[-136,58],[-145,60],[-152,58],[-160,56],[-165,60],[-168,65]],
        /* greenland */ [[-73,78],[-65,80],[-55,82],[-40,83],[-25,80],[-21,74],[-26,70],[-34,66],[-42,60],[-50,62],[-53,67],[-58,70],[-66,74],[-73,78]],
        /* s_america */ [[-81,8],[-76,9],[-71,12],[-64,11],[-60,8],[-52,5],[-50,0],[-44,-2],[-38,-5],[-35,-8],[-38,-13],[-39,-18],[-48,-25],[-53,-34],[-58,-38],[-62,-40],[-63,-45],[-66,-50],[-69,-55],[-74,-52],[-73,-45],[-73,-37],[-71,-30],[-70,-23],[-70,-18],[-76,-14],[-81,-6],[-80,0],[-78,2],[-77,4],[-81,8]],
        /* australia */ [[114,-22],[114,-26],[116,-35],[123,-34],[129,-32],[135,-35],[138,-35],[141,-38],[147,-38],[150.5,-37.5],[153.5,-28],[146,-19],[142,-11],[137,-12],[136,-15],[131,-12],[129,-15],[125,-14],[122,-17],[114,-22]],
        /* tasmania */ [[145,-41],[148,-41],[148,-43],[145,-43],[145,-41]],
        /* nz_north */ [[173,-35],[175,-37],[178,-38],[176,-41],[174,-41],[173,-35]],
        /* nz_south */ [[167,-45],[174,-41],[171,-46],[167,-47],[167,-45]],
        /* antarctica */ [[-180,-70],[-150,-76],[-110,-74],[-70,-70],[-45,-78],[-10,-70],[20,-69],[60,-67],[90,-66],[120,-66],[150,-70],[180,-72],[180,-90],[-180,-90],[-180,-70]],
        /* iceland */ [[-24,64],[-14,66],[-14,64],[-22,63],[-24,64]]
    ];

    var WATER = [
        /* mediterranean */ [[-5,36.5],[3,37.5],[13,38],[11,34],[20,32],[28,32],[34,33],[36,36],[30,36.5],[25,35.5],[19,36],[13,40],[4,41.5],[-3,36.5],[-5,36.5]],
        /* black_sea */ [[28,41],[41,42],[41,45],[31,46],[28,44],[28,41]],
        /* caspian */ [[47,37],[54,41],[53,47],[48,46],[47,37]],
        /* persian_gulf */ [[48,30],[54,26],[55,24.5],[49,28],[48,30]],
        /* red_sea */ [[33,28],[43,13],[40,12],[32,25],[33,28]],
        /* baltic */ [[15,55],[20,55.5],[20.5,57.5],[19,60],[18,58],[16,56],[15,55]],
        /* hudson */ [[-95,58],[-80,58],[-77,62],[-82,66],[-92,64],[-95,58]],
        /* california_gulf */ [[-114,31],[-110,24],[-108,24],[-113,31],[-114,31]],
        /* bothnia */ [[18.5,62],[22,64],[24,66],[20.5,66],[17.5,63],[18.5,62]]
    ];

    /* Representative city per zone in main.js's timeZones dict. Markers are
       drawn from these directly, so island zones with no landmass of their
       own at this resolution (Honolulu, Fiji, Tonga) still appear. */
    var TZ_CITY = {
        'Africa/Accra': [-0.2, 5.6],          'Africa/Cairo': [31.2, 30.0],
        'Africa/Johannesburg': [28.0, -26.2], 'Africa/Lagos': [3.4, 6.5],
        'Asia/Dubai': [55.3, 25.3],           'Asia/Kolkata': [88.4, 22.6],
        'Asia/Dhaka': [90.4, 23.8],           'Asia/Colombo': [79.9, 6.9],
        'Asia/Bangkok': [100.5, 13.8],        'Asia/Shanghai': [121.5, 31.2],
        'Asia/Tokyo': [139.7, 35.7],          'Asia/Seoul': [127.0, 37.6],
        'Asia/Singapore': [103.8, 1.35],      'Australia/Sydney': [151.2, -33.9],
        'Australia/Adelaide': [138.6, -34.9], 'Australia/Perth': [115.9, -31.95],
        'Pacific/Auckland': [174.8, -36.9],   'Pacific/Fiji': [178.4, -18.1],
        'Pacific/Tongatapu': [-175.2, -21.1], 'America/Edmonton': [-113.5, 53.5],
        'America/New_York': [-74.0, 40.7],    'America/Chicago': [-87.6, 41.9],
        'America/Denver': [-105.0, 39.7],     'America/Phoenix': [-112.1, 33.4],
        'America/Los_Angeles': [-118.2, 34.1],'America/Anchorage': [-149.9, 61.2],
        'Pacific/Honolulu': [-157.9, 21.3],   'America/Toronto': [-79.4, 43.7],
        'America/Mexico_City': [-99.1, 19.4], 'America/Caracas': [-66.9, 10.5],
        'America/Santiago': [-70.7, -33.4],   'America/Lima': [-77.0, -12.0],
        'America/Bogota': [-74.1, 4.7],       'America/Argentina/Buenos_Aires': [-58.4, -34.6],
        'Europe/London': [-0.13, 51.5],       'Europe/Paris': [2.35, 48.9],
        'Europe/Berlin': [13.4, 52.5],        'Europe/Rome': [12.5, 41.9],
        'Europe/Madrid': [-3.7, 40.4],        'Europe/Amsterdam': [4.9, 52.4],
        'Europe/Stockholm': [18.1, 59.3],     'Europe/Istanbul': [29.0, 41.0],
        'Europe/Moscow': [37.6, 55.8]
    };

    /* --- geometry ------------------------------------------------------ */

    function inside(poly, x, y) {
        var c = false, n = poly.length, i, j, xi, yi, xj, yj;
        for (i = 0, j = n - 1; i < n; j = i++) {
            xi = poly[i][0]; yi = poly[i][1];
            xj = poly[j][0]; yj = poly[j][1];
            if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c;
        }
        return c;
    }

    function isLand(lon, lat) {
        var i, hit = false;
        for (i = 0; i < LAND.length; i++) {
            if (inside(LAND[i], lon, lat)) { hit = true; break; }
        }
        if (!hit) return false;
        for (i = 0; i < WATER.length; i++) {
            if (inside(WATER[i], lon, lat)) return false;
        }
        return true;
    }

    /* Dot grid. The longitude step widens with latitude so dots stay evenly
       spaced across the sphere instead of bunching up at the poles. */
    var STEP = 2.6;
    var dots = [];

    function buildDots() {
        var lat, lon, lonStep, cl;
        for (lat = -88; lat <= 88; lat += STEP) {
            lonStep = STEP / Math.max(Math.cos(lat * DEG), 0.18);
            for (lon = -180; lon < 180; lon += lonStep) {
                if (!isLand(lon, lat)) continue;
                cl = Math.cos(lat * DEG);
                dots.push({
                    lon: lon,
                    x: cl * Math.sin(lon * DEG),
                    y: Math.sin(lat * DEG),
                    z: cl * Math.cos(lon * DEG),
                    band: 0
                });
            }
        }
    }

    /* --- timezone offsets ---------------------------------------------- */

    /* Minutes east of UTC for an IANA zone right now. Going through Intl
       means DST is handled for free and the data never goes stale. */
    function offsetMinutes(tz, date) {
        try {
            var parts = new Intl.DateTimeFormat('en-US', {
                timeZone: tz, hour12: false,
                year: 'numeric', month: '2-digit', day: '2-digit',
                hour: '2-digit', minute: '2-digit', second: '2-digit'
            }).formatToParts(date);
            var p = {}, i;
            for (i = 0; i < parts.length; i++) p[parts[i].type] = parts[i].value;
            var hour = p.hour === '24' ? 0 : Number(p.hour);
            var asUTC = Date.UTC(Number(p.year), Number(p.month) - 1, Number(p.day),
                                 hour, Number(p.minute), Number(p.second));
            return Math.round((asUTC - Math.floor(date.getTime() / 1000) * 1000) / 60000);
        } catch (e) {
            return null;   // unknown zone: draw no band rather than guessing
        }
    }

    /* A zone's band is the 15 degree slice centred on its offset meridian.
       Real zone borders are political and jagged; the idealised band is what
       reads clearly at this scale. Fractional offsets (+5:30, +9:30) land
       correctly because the centre is derived from minutes, not hours. */
    function bandCentre(mins) { return mins / 4; }

    function angDiff(a, b) {
        var d = (a - b) % 360;
        if (d > 180) d -= 360;
        if (d < -180) d += 360;
        return d;
    }

    /* --- colour --------------------------------------------------------- */

    var colBase = [185, 214, 242], colMain = [0, 109, 170], colAlt = [3, 83, 164];

    function readVar(name, fallback) {
        var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
        var m = /^#([0-9a-f]{6})$/i.exec(v), n;
        if (m) {
            n = parseInt(m[1], 16);
            return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
        }
        var r = /rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)/i.exec(v);
        return r ? [+r[1], +r[2], +r[3]] : fallback;
    }

    function refreshColors() {
        colBase = readVar('--text-color', colBase);
        colMain = readVar('--accent-color2', colMain);
        colAlt  = readVar('--accent-color1', colAlt);
    }

    function rgba(c, a) { return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')'; }

    /* --- state ---------------------------------------------------------- */

    var canvas, ctx, W = 0, H = 0, dpr = 1;
    var lon0 = 0, targetLon0 = 0;      // globe rotation, degrees
    var lat0 = 16 * DEG;               // fixed northward tilt
    var markers = [];
    var running = false, raf = 0, lastDraw = 0;

    /* The pulse only needs to look smooth, not hit 60fps. Halving the frame
       rate roughly halves the background CPU cost on laptops. */
    var MIN_FRAME_MS = 33;

    var reduceMotion = window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function resize() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        W = window.innerWidth;
        H = window.innerHeight;
        canvas.width  = Math.round(W * dpr);
        canvas.height = Math.round(H * dpr);
        canvas.style.width  = W + 'px';
        canvas.style.height = H + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    /* --- public: which zones are lit ------------------------------------ */

    /* primaryTz - the main world-clock zone, drawn brightest and rotated to
       otherTz   - array of every extra clock's zone, drawn dimmer */
    function setZones(primaryTz, otherTz) {
        if (!ctx) return;
        var now = new Date();
        var bands = [];
        markers = [];

        function add(tz, primary) {
            if (!tz) return;
            var mins = offsetMinutes(tz, now);
            if (mins !== null) bands.push({ centre: bandCentre(mins), primary: primary });
            var city = TZ_CITY[tz];
            if (city) markers.push({ lon: city[0], lat: city[1], primary: primary });
        }

        add(primaryTz, true);
        (otherTz || []).forEach(function (tz) { add(tz, false); });

        // 0 = unlit, 1 = an extra clock's band, 2 = the main clock's band
        var i, b, v;
        for (i = 0; i < dots.length; i++) {
            v = 0;
            for (b = 0; b < bands.length; b++) {
                if (Math.abs(angDiff(dots[i].lon, bands[b].centre)) <= 7.5) {
                    if (bands[b].primary) { v = 2; break; }
                    v = 1;
                }
            }
            dots[i].band = v;
        }

        // bring the main zone round to face the viewer
        if (primaryTz && TZ_CITY[primaryTz]) {
            targetLon0 = TZ_CITY[primaryTz][0];
            if (reduceMotion) lon0 = targetLon0;
        }
        start();
    }

    /* --- drawing --------------------------------------------------------- */

    function project(lon, lat, ca, sa, cb, sb) {
        var cl = Math.cos(lat * DEG);
        var x = cl * Math.sin(lon * DEG);
        var y = Math.sin(lat * DEG);
        var z = cl * Math.cos(lon * DEG);
        var rx = x * ca + z * sa;
        var rz = -x * sa + z * ca;
        return { x: rx, y: y * cb - rz * sb, z: y * sb + rz * cb };
    }

    function draw(t) {
        raf = 0;
        var rotating = lon0 !== targetLon0;

        // skip the frame unless enough time has passed, but never while the
        // globe is mid-rotation, where dropped frames would show as judder
        if (!rotating && t - lastDraw < MIN_FRAME_MS) {
            if (running) raf = requestAnimationFrame(draw);
            return;
        }
        lastDraw = t;
        ctx.clearRect(0, 0, W, H);

        // ease rotation toward the selected zone, the short way round
        var delta = angDiff(targetLon0, lon0);
        if (Math.abs(delta) > 0.05) lon0 += delta * 0.06;
        else lon0 = targetLon0;
        var settled = lon0 === targetLon0;

        var R  = Math.min(W, H) * 0.42;
        var cx = W / 2, cy = H / 2;
        var a  = -lon0 * DEG;
        var ca = Math.cos(a), sa = Math.sin(a);
        var cb = Math.cos(lat0), sb = Math.sin(lat0);
        var pulse = reduceMotion ? 1 : 0.55 + 0.45 * Math.sin(t / 420);
        var base  = Math.max(1.1, R / 150);
        var i, d, rx, rz, ry, zz, px, py, depth, col, alpha, size, m, pt, r;

        for (i = 0; i < dots.length; i++) {
            d = dots[i];
            rx = d.x * ca + d.z * sa;
            rz = -d.x * sa + d.z * ca;
            ry = d.y * cb - rz * sb;
            zz = d.y * sb + rz * cb;
            if (zz <= 0.02) continue;                 // far side of the globe

            px = cx + rx * R;
            py = cy - ry * R;
            depth = 0.35 + 0.65 * zz;                 // fade toward the limb

            if (d.band === 2) {
                col = colMain; alpha = depth * (0.85 * pulse + 0.15); size = base * 1.5;
            } else if (d.band === 1) {
                col = colAlt;  alpha = depth * 0.75;  size = base * 1.3;
            } else {
                col = colBase; alpha = depth * 0.30;  size = base;
            }

            ctx.fillStyle = rgba(col, alpha.toFixed(3));
            ctx.fillRect(px - size / 2, py - size / 2, size, size);
        }

        // city markers on top, from true coordinates rather than the dot grid
        for (i = 0; i < markers.length; i++) {
            m = markers[i];
            pt = project(m.lon, m.lat, ca, sa, cb, sb);
            if (pt.z <= 0.02) continue;

            px = cx + pt.x * R;
            py = cy - pt.y * R;
            col = m.primary ? colMain : colAlt;
            r = base * (m.primary ? 1.9 : 1.4);

            if (m.primary) {
                ctx.beginPath();
                ctx.arc(px, py, r * (2.2 + 1.8 * pulse), 0, Math.PI * 2);
                ctx.fillStyle = rgba(col, (0.18 * (1 - pulse) + 0.05).toFixed(3));
                ctx.fill();
            }
            ctx.beginPath();
            ctx.arc(px, py, r, 0, Math.PI * 2);
            ctx.fillStyle = rgba(col, m.primary ? 0.95 : 0.7);
            ctx.fill();
        }

        // with reduced motion there is nothing to animate once rotation settles
        if (running && !(reduceMotion && settled)) {
            raf = requestAnimationFrame(draw);
        }
    }

    function start() {
        if (!ctx) return;
        running = true;
        if (!raf) raf = requestAnimationFrame(draw);
    }

    function stop() {
        running = false;
        if (raf) { cancelAnimationFrame(raf); raf = 0; }
    }

    /* --- init ------------------------------------------------------------ */

    function init() {
        canvas = document.getElementById('globeCanvas');
        if (!canvas || !canvas.getContext) return;
        ctx = canvas.getContext('2d');

        buildDots();
        refreshColors();
        resize();

        var rt = 0;
        window.addEventListener('resize', function () {
            clearTimeout(rt);
            rt = setTimeout(function () { resize(); start(); }, 120);
        });

        // nothing worth animating while the tab is hidden
        document.addEventListener('visibilitychange', function () {
            if (document.hidden) stop(); else start();
        });

        start();
    }

    window.Globe = {
        init: init,
        setZones: setZones,
        refreshColors: function () { refreshColors(); start(); }
    };
})();
