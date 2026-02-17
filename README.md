<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title id="tab-title">Google Docs</title>
    <link id="favicon" rel="icon" href="https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico" type="image/x-icon">
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;900&family=JetBrains+Mono:wght@300;500&family=Outfit:wght@300;600&display=swap" rel="stylesheet">
    <style>
        :root { 
            --bg-main: #05010a; 
            --accent-hue: 280;
            --accent: hsl(var(--accent-hue), 100%, 53%); 
            --accent-glow: hsla(var(--accent-hue), 100%, 53%, 0.5);
            --glass: rgba(10, 2, 20, 0.85); 
            --border: hsla(var(--accent-hue), 100%, 53%, 0.3);
            --safe-green: #00ff99;
            --warning-orange: #ff9500;
        }

        body { 
            margin: 0; padding: 0; 
            font-family: 'Outfit', sans-serif; 
            background: var(--bg-main);
            color: #fff; overflow: hidden; height: 100vh;
            transition: opacity 0.5s ease, filter 0.5s ease;
        }

        /* --- PROXY VIEWER STYLES --- */
        #proxy-container {
            position: fixed;
            inset: 0;
            z-index: 12000;
            background: #000;
            display: none;
            flex-direction: column;
        }

        #proxy-header {
            height: 50px;
            background: var(--glass);
            border-bottom: 1px solid var(--border);
            display: flex;
            align-items: center;
            padding: 0 20px;
            gap: 15px;
            backdrop-filter: blur(10px);
        }

        #proxy-frame {
            flex-grow: 1;
            border: none;
            background: white;
        }

        .proxy-control {
            background: var(--accent);
            color: white;
            border: none;
            padding: 6px 15px;
            font-family: 'Orbitron';
            font-size: 0.7rem;
            cursor: pointer;
            border-radius: 4px;
        }

        /* --- REST OF THE ORIGINAL STYLES --- */
        body::before {
            content: '';
            position: fixed;
            top: 0; left: 0;
            width: 100%; height: 100%;
            background: radial-gradient(circle 150px at var(--mouse-x, 50%) var(--mouse-y, 50%), hsla(var(--accent-hue), 100%, 50%, 0.15), transparent 80%);
            pointer-events: none;
            z-index: 5;
        }

        #bg-layer { position: fixed; inset: 0; z-index: -1; background-size: cover; background-position: center; transition: filter 0.3s; }
        #scanlines { position: fixed; inset: 0; background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.2) 50%); background-size: 100% 3px; z-index: 5000; pointer-events: none; opacity: 0; }
        .scanlines-on #scanlines { opacity: 1; }

        #neural-header { position: fixed; top: 20px; left: 20px; right: 20px; display: flex; justify-content: space-between; z-index: 1000; }
        .header-pill { background: var(--glass); padding: 8px 18px; border-radius: 6px; border: 1px solid var(--border); backdrop-filter: blur(15px); font-family: 'JetBrains Mono'; color: var(--accent); font-size: 0.75rem; display: flex; align-items: center; gap: 8px; }

        #main-content { text-align: center; padding-top: 15vh; height: 100vh; position: relative; z-index: 10; }
        h1 { font-family: 'Orbitron'; font-size: 4.5rem; letter-spacing: 12px; margin: 20px 0; }

        #search-box { width: 450px; padding: 15px 25px; background: rgba(0,0,0,0.4); border: 1px solid var(--border); border-radius: 4px; color: white; font-family: 'JetBrains Mono'; outline: none; transition: 0.3s; }
        #search-box:focus { width: 520px; border-color: var(--accent); box-shadow: 0 0 20px var(--accent-glow); }

        .nav-btn { display: inline-block; margin: 10px; padding: 12px 30px; background: rgba(255,255,255,0.03); border: 1px solid var(--border); color: white; text-decoration: none; font-family: 'Orbitron'; font-size: 0.75rem; letter-spacing: 2px; transition: 0.3s; }
        .nav-btn:hover { background: var(--accent); box-shadow: 0 0 20px var(--accent-glow); transform: scale(1.05); }

        #stars-canvas { position: fixed; inset: 0; z-index: -2; background: #05010a; }
        .star { position: absolute; background: #fff; border-radius: 50%; }

        #system-logs { position: fixed; bottom: 20px; left: 20px; width: 260px; height: 130px; background: rgba(0,0,0,0.8); border: 1px solid var(--border); border-radius: 4px; font-family: 'JetBrains Mono'; font-size: 0.6rem; color: var(--safe-green); padding: 10px; overflow: hidden; z-index: 500; }
    </style>
</head>
<body onmousemove="handleMouseMove(event)">

    <div id="bg-layer"></div>
    <div id="scanlines"></div>
    <div id="stars-canvas"></div>
    <div id="system-logs"></div>

    <div id="proxy-container">
        <div id="proxy-header">
            <span style="font-family:'Orbitron'; font-size: 0.8rem; color:var(--accent);">SECURE UPLINK ACTIVE</span>
            <button class="proxy-control" onclick="closeUplink()">TERMINATE SESSION</button>
            <button class="proxy-control" style="background:#444;" onclick="reloadProxy()">REFRESH</button>
        </div>
        <iframe id="proxy-frame" src=""></iframe>
    </div>

    <div id="neural-header">
        <div class="header-pill" id="neural-clock">00:00:00</div>
        <div class="header-pill" id="pilot-id">PILOT: UNKNOWN</div>
    </div>

    <div id="main-content">
        <form id="search-form">
            <input type="text" id="search-box" placeholder="SEARCH DUCKDUCKGO VIA UPLINK...">
        </form>
        
        <h1 id="glitch-title">GALAXY PRO</h1>

        <div>
            <a href="#" onclick="launchUplink('https://poki.com')" class="nav-btn">GAMES</a>
            <a href="#" onclick="launchUplink('https://duckduckgo.com')" class="nav-btn">SEARCH</a>
            <a href="#" onclick="launchUplink('https://discord.com')" class="nav-btn">UPLINK</a>
        </div>
    </div>

    <script>
        // --- PROXY LOGIC (Forge Style) ---
        // Note: For a true proxy, you usually link to a service worker like Ultraviolet.
        // This simulates the behavior using a redirected uplink.
        const PROXY_SERVER = "https://api.allorigins.win/raw?url="; // Simple proxy bridge

        document.getElementById('search-form').addEventListener('submit', function(e) {
            e.preventDefault();
            const query = document.getElementById('search-box').value;
            let targetUrl;

            if (query.includes('.') && !query.includes(' ')) {
                targetUrl = query.startsWith('http') ? query : 'https://' + query;
            } else {
                targetUrl = 'https://duckduckgo.com/?q=' + encodeURIComponent(query);
            }
            
            launchUplink(targetUrl);
        });

        function launchUplink(url) {
            const container = document.getElementById('proxy-container');
            const frame = document.getElementById('proxy-frame');
            
            logMessage("INITIATING UPLINK: " + url);
            
            // In a production environment, you'd use your specific proxy URL here
            // Example: frame.src = "/service/" + btoa(url); 
            frame.src = url; 
            
            container.style.display = 'flex';
        }

        function closeUplink() {
            document.getElementById('proxy-container').style.display = 'none';
            document.getElementById('proxy-frame').src = '';
            logMessage("UPLINK TERMINATED.");
        }

        function reloadProxy() {
            document.getElementById('proxy-frame').contentWindow.location.reload();
            logMessage("UPLINK REFRESHED.");
        }

        // --- CORE UI LOGIC ---
        function handleMouseMove(e) {
            document.body.style.setProperty('--mouse-x', e.clientX + 'px');
            document.body.style.setProperty('--mouse-y', e.clientY + 'px');
        }

        function logMessage(msg) {
            const lb = document.getElementById('system-logs');
            const div = document.createElement('div');
            div.innerText = `> [${new Date().toLocaleTimeString()}] ${msg}`;
            lb.prepend(div);
            if(lb.childNodes.length > 5) lb.lastChild.remove();
        }

        // Clock
        setInterval(() => {
            document.getElementById('neural-clock').innerText = new Date().toLocaleTimeString();
        }, 1000);

        // Star Engine
        function initStars() {
            const canvas = document.getElementById('stars-canvas');
            for(let i=0; i<80; i++) {
                const star = document.createElement('div');
                star.className = 'star';
                star.style.width = Math.random()*3+'px';
                star.style.height = star.style.width;
                star.style.left = Math.random()*100+'vw';
                star.style.top = Math.random()*100+'vh';
                star.style.opacity = Math.random();
                canvas.appendChild(star);
            }
        }
        initStars();
        logMessage("SYSTEM READY: GALAXY_PRO_V2");
    </script>
</body>
</html>
