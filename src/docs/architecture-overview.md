# Architecture Overview

This page provides visual diagrams illustrating the flow of data and requests through the AURA application's various components and microservices.

## AMER Authentication & Access Request Flow

This diagram shows the steps involved when a user authenticates and requests access via the AMER-specific services.

<div>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 650">
  <!-- Background layers for network segments -->
  <rect x="50" y="50" width="700" height="180" fill="#f0f8ff" rx="10" ry="10" stroke="#4682b4" stroke-width="2"/>
  <text x="60" y="75" font-family="Arial" font-size="18" font-weight="bold" fill="#4682b4">AMER (Internet Facing)</text>
  
  <rect x="50" y="270" width="700" height="150" fill="#fff0f5" rx="10" ry="10" stroke="#db7093" stroke-width="2"/>
  <text x="60" y="295" font-family="Arial" font-size="18" font-weight="bold" fill="#db7093">DMZ (Intermediary)</text>
  
  <rect x="50" y="460" width="700" height="150" fill="#f0fff0" rx="10" ry="10" stroke="#3cb371" stroke-width="2"/>
  <text x="60" y="485" font-family="Arial" font-size="18" font-weight="bold" fill="#3cb371">CLAN (Isolated)</text>
  
  <!-- AMER Components -->
  <rect x="100" y="100" width="120" height="60" fill="#87ceeb" rx="5" ry="5" stroke="#4169e1" stroke-width="2"/>
  <text x="160" y="135" font-family="Arial" font-size="14" text-anchor="middle" fill="#000">React Frontend</text>
  
  <rect x="300" y="100" width="120" height="60" fill="#87ceeb" rx="5" ry="5" stroke="#4169e1" stroke-width="2"/>
  <text x="360" y="125" font-family="Arial" font-size="14" text-anchor="middle" fill="#000">Auth Service</text>
  <text x="360" y="143" font-family="Arial" font-size="12" text-anchor="middle" fill="#000">Container</text>
  
  <rect x="590" y="100" width="120" height="60" fill="#87ceeb" rx="5" ry="5" stroke="#4169e1" stroke-width="2"/>
  <text x="650" y="125" font-family="Arial" font-size="14" text-anchor="middle" fill="#000">AMER Domain</text>
  <text x="650" y="143" font-family="Arial" font-size="12" text-anchor="middle" fill="#000">Controller</text>
  
  <rect x="300" y="180" width="120" height="70" fill="#87ceeb" rx="5" ry="5" stroke="#4169e1" stroke-width="2"/>
  <text x="360" y="202" font-family="Arial" font-size="14" text-anchor="middle" fill="#000">AMER API</text>
  <text x="360" y="222" font-family="Arial" font-size="12" text-anchor="middle" fill="#000">Publisher Service</text>
  <text x="360" y="242" font-family="Arial" font-size="10" text-anchor="middle" fill="#000">(Node.js Container)</text>
  
  <!-- DMZ Components -->
  <rect x="100" y="310" width="120" height="60" fill="#ffb6c1" rx="5" ry="5" stroke="#c71585" stroke-width="2"/>
  <text x="160" y="343" font-family="Arial" font-size="14" text-anchor="middle" fill="#000">PostgreSQL</text>
  
  <rect x="300" y="310" width="120" height="60" fill="#ffb6c1" rx="5" ry="5" stroke="#c71585" stroke-width="2"/>
  <text x="360" y="330" font-family="Arial" font-size="14" text-anchor="middle" fill="#000">RabbitMQ</text>
  <text x="360" y="348" font-family="Arial" font-size="12" text-anchor="middle" fill="#000">Message Broker</text>
  
  <rect x="500" y="310" width="140" height="70" fill="#ffb6c1" rx="5" ry="5" stroke="#c71585" stroke-width="2"/>
  <text x="570" y="330" font-family="Arial" font-size="14" text-anchor="middle" fill="#000">DMZ Microservice</text>
  <text x="570" y="350" font-family="Arial" font-size="12" text-anchor="middle" fill="#000">Consumer/Publisher</text>
  <text x="570" y="370" font-family="Arial" font-size="10" text-anchor="middle" fill="#000">(Node.js Container)</text>
  
  <!-- CLAN Components -->
  <rect x="100" y="500" width="120" height="60" fill="#90ee90" rx="5" ry="5" stroke="#228b22" stroke-width="2"/>
  <text x="160" y="520" font-family="Arial" font-size="14" text-anchor="middle" fill="#000">Active Directory</text>
  <text x="160" y="538" font-family="Arial" font-size="12" text-anchor="middle" fill="#000">Domains</text>
  
  <rect x="300" y="500" width="120" height="90" fill="#90ee90" rx="5" ry="5" stroke="#228b22" stroke-width="2"/>
  <text x="360" y="525" font-family="Arial" font-size="14" text-anchor="middle" fill="#000">CLAN Consumer</text>
  <text x="360" y="548" font-family="Arial" font-size="12" text-anchor="middle" fill="#000">Service</text>
  <text x="360" y="582" font-family="Arial" font-size="10" text-anchor="middle" fill="#000">(Node.js Container)</text>
  
  <rect x="500" y="500" width="120" height="60" fill="#90ee90" rx="5" ry="5" stroke="#228b22" stroke-width="2"/>
  <text x="560" y="520" font-family="Arial" font-size="14" text-anchor="middle" fill="#000">Node.js Backend</text>
  <text x="560" y="545" font-family="Arial" font-size="12" text-anchor="middle" fill="#000">Application</text>
  
  <!-- Connections and Flows -->
  <!-- Authentication Flow -->
  <line x1="220" y1="120" x2="300" y2="120" stroke="#000" stroke-width="2" stroke-dasharray="5,5"/>
  <text x="260" y="110" font-family="Arial" font-size="10" text-anchor="middle" fill="#000">Auth Request</text>
  
  <line x1="420" y1="120" x2="590" y2="120" stroke="#000" stroke-width="2" stroke-dasharray="5,5"/>
  <polygon points="585,115 590,120 585,125" fill="#000"/>
  
  <line x1="590" y1="140" x2="420" y2="140" stroke="#000" stroke-width="2" stroke-dasharray="5,5"/>
  <polygon points="425,135 420,140 425,145" fill="#000"/>
  
  <line x1="300" y1="140" x2="220" y2="140" stroke="#000" stroke-width="2" stroke-dasharray="5,5"/>
  <text x="260" y="155" font-family="Arial" font-size="10" text-anchor="middle" fill="#000">Auth Response</text>
  
  <circle cx="270" cy="130" r="12" fill="#fff" stroke="#000" stroke-width="1"/>
  <text x="270" y="134" font-family="Arial" font-size="10" font-weight="bold" text-anchor="middle" fill="#000">1</text>
  
  <!-- Access Request Flow From Frontend to AMER API Publisher -->
  <line x1="160" y1="160" x2="160" y2="210" stroke="#4169e1" stroke-width="2"/>
  <line x1="160" y1="210" x2="300" y2="210" stroke="#4169e1" stroke-width="2"/>
  <polygon points="295,205 300,210 295,215" fill="#4169e1"/>
  <text x="230" y="200" font-family="Arial" font-size="10" text-anchor="middle" fill="#000">Access Request</text>
  
  <circle cx="230" cy="210" r="12" fill="#fff" stroke="#000" stroke-width="1"/>
  <text x="230" y="214" font-family="Arial" font-size="10" font-weight="bold" text-anchor="middle" fill="#000">2</text>
  
  <!-- AMER to DMZ Flow -->
  <line x1="360" y1="250" x2="360" y2="310" stroke="#ff6347" stroke-width="2"/>
  <polygon points="355,305 360,310 365,305" fill="#ff6347"/>
  <text x="410" y="280" font-family="Arial" font-size="10" text-anchor="middle" fill="#000">Publish to Queue</text>
  
  <circle cx="360" cy="280" r="12" fill="#fff" stroke="#000" stroke-width="1"/>
  <text x="360" y="284" font-family="Arial" font-size="10" font-weight="bold" text-anchor="middle" fill="#000">3</text>
  
  <!-- DMZ Microservice to RabbitMQ -->
  <line x1="500" y1="340" x2="420" y2="340" stroke="#c71585" stroke-width="2"/>
  <polygon points="425,335 420,340 425,345" fill="#c71585"/>
  <text x="460" y="330" font-family="Arial" font-size="10" text-anchor="middle" fill="#000">Consume</text>
  
  <!-- PostgreSQL to DMZ Microservice -->
  <line x1="220" y1="340" x2="300" y2="340" stroke="#c71585" stroke-width="2"/>
  <text x="260" y="330" font-family="Arial" font-size="10" text-anchor="middle" fill="#000">Query</text>
  
  <circle cx="365" cy="370" r="12" fill="#fff" stroke="#000" stroke-width="1"/>
  <text x="365" y="374" font-family="Arial" font-size="10" font-weight="bold" text-anchor="middle" fill="#000">4</text>
  
  <!-- DMZ to CLAN Flow -->
  <line x1="570" y1="380" x2="570" y2="440" stroke="#ff6347" stroke-width="2"/>
  <line x1="570" y1="440" x2="360" y2="500" stroke="#ff6347" stroke-width="2"/>
  <polygon points="367,501 360,500 364,494" fill="#ff6347"/>
  <text x="430" y="450" font-family="Arial" font-size="10" text-anchor="middle" fill="#000">Forward Request</text>
  
  <circle cx="500" cy="450" r="12" fill="#fff" stroke="#000" stroke-width="1"/>
  <text x="500" y="454" font-family="Arial" font-size="10" font-weight="bold" text-anchor="middle" fill="#000">5</text>
  
  <!-- CLAN Consumer to Backend -->
  <line x1="420" y1="545" x2="500" y2="545" stroke="#228b22" stroke-width="2"/>
  <polygon points="495,540 500,545 495,550" fill="#228b22"/>
  <text x="460" y="525" font-family="Arial" font-size="10" text-anchor="middle" fill="#000">Process Request</text>
  
  <circle cx="460" r="12" cy="570" fill="#fff" stroke="#000" stroke-width="1"/>
  <text x="460" y="574" font-family="Arial" font-size="10" font-weight="bold" text-anchor="middle" fill="#000">6</text>
  
  <!-- Backend to Active Directory -->
  <line x1="500" y1="535" x2="220" y2="535" stroke="#228b22" stroke-width="2"/>
  <polygon points="225,530 220,535 225,540" fill="#228b22"/>
  <text x="360" y="565" font-family="Arial" font-size="10" text-anchor="middle" fill="#000">Update Access</text>
  
  <!-- Return Path (Response Flow) -->
  <circle cx="600" cy="400" r="12" fill="#fff" stroke="#000" stroke-width="1"/>
  <text x="600" y="404" font-family="Arial" font-size="10" font-weight="bold" text-anchor="middle" fill="#000">7</text>
  
<!-- Legend -->
  <rect x="640" y="540" width="15" height="10" fill="none" stroke="#ff6347" stroke-width="2"/>
  <text x="665" y="548" font-family="Arial" font-size="12" fill="#000">Request Flow</text>
  

</svg>
</div>

### Flow Explanation

1.  **Authentication:** The user first authenticates against the AMER Domain Controller via the dedicated Auth Service container.
2.  **Access Request:** The user initiates an access request from the React Frontend, which hits the AMER API Publisher Service.
3.  **Publish to DMZ:** The Publisher Service formats the request and sends it to the RabbitMQ message broker located in the DMZ.
4.  **DMZ Processing:** A dedicated DMZ Microservice consumes the message from RabbitMQ. It might enrich the request with data queried from a PostgreSQL database (also in the DMZ).
5.  **Forward to CLAN:** The DMZ Microservice securely forwards the processed request to the CLAN Consumer Service in the isolated CLAN network.
6.  **Backend Processing:** The CLAN Consumer relays the request to the main Node.js Backend Application. This backend contains the core logic to process the request and interact with Active Directory.
7.  **Active Directory Update:** The Backend Application communicates with the necessary Active Directory Domain Controllers within the CLAN to grant or modify the requested access.
8.  **Response:** A confirmation or status update flows back through the reverse path, eventually reaching the user's React Frontend.