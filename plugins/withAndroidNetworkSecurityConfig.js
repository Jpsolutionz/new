const { withAndroidManifest } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

module.exports = function withAndroidNetworkSecurityConfig(config) {
  return withAndroidManifest(config, async (config) => {
    const androidManifest = config.modResults;
    
    // Add network security config reference to application tag
    const application = androidManifest.manifest.application[0];
    application.$['android:networkSecurityConfig'] = '@xml/network_security_config';
    
    // Create the network_security_config.xml file
    const projectRoot = config.modRequest.projectRoot;
    const resDir = path.join(projectRoot, 'android', 'app', 'src', 'main', 'res');
    const xmlDir = path.join(resDir, 'xml');
    
    // Create xml directory if it doesn't exist
    if (!fs.existsSync(xmlDir)) {
      fs.mkdirSync(xmlDir, { recursive: true });
    }
    
    // Create network_security_config.xml to allow HTTP traffic
    const networkSecurityConfig = `<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <!-- Allow HTTP traffic for EC2 server -->
    <domain-config cleartextTrafficPermitted="true">
        <domain includeSubdomains="true">13.60.249.27</domain>
    </domain-config>
    
    <!-- Base config to allow HTTP -->
    <base-config cleartextTrafficPermitted="true">
        <trust-anchors>
            <certificates src="system" />
        </trust-anchors>
    </base-config>
</network-security-config>`;
    
    const configPath = path.join(xmlDir, 'network_security_config.xml');
    fs.writeFileSync(configPath, networkSecurityConfig);
    
    return config;
  });
};

