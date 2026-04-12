ALTER TABLE `technologies` ADD `icon` text;--> statement-breakpoint
ALTER TABLE `technologies` ADD `featured` integer DEFAULT false NOT NULL;--> statement-breakpoint

UPDATE `technologies` SET `icon` = 'uil:linux' WHERE `slug` = 'linux';
UPDATE `technologies` SET `icon` = 'mdi:docker' WHERE `slug` = 'docker';
UPDATE `technologies` SET `icon` = 'file-icons:caddy' WHERE `slug` = 'caddy';
UPDATE `technologies` SET `icon` = 'simple-icons:authentik' WHERE `slug` = 'authentik';
UPDATE `technologies` SET `icon` = 'devicon-plain:grafana' WHERE `slug` = 'grafana';
UPDATE `technologies` SET `icon` = 'simple-icons:homeassistant' WHERE `slug` = 'home-assistant';
UPDATE `technologies` SET `icon` = 'simple-icons:git' WHERE `slug` = 'git';
UPDATE `technologies` SET `icon` = 'simple-icons:react' WHERE `slug` = 'react';
UPDATE `technologies` SET `icon` = 'teenyicons:vue-solid' WHERE `slug` = 'vue';
UPDATE `technologies` SET `icon` = 'simple-icons:flutter' WHERE `slug` = 'flutter';
UPDATE `technologies` SET `icon` = 'simple-icons:typescript' WHERE `slug` = 'typescript';
UPDATE `technologies` SET `icon` = 'simple-icons:dart' WHERE `slug` = 'dart';
UPDATE `technologies` SET `icon` = 'simple-icons:rust' WHERE `slug` = 'rust';
UPDATE `technologies` SET `icon` = 'simple-icons:tailwindcss' WHERE `slug` = 'tailwind';
UPDATE `technologies` SET `icon` = 'simple-icons:nuxt' WHERE `slug` = 'nuxt';
UPDATE `technologies` SET `icon` = 'simple-icons:markdown' WHERE `slug` = 'markdown';
UPDATE `technologies` SET `icon` = 'simple-icons:vite' WHERE `slug` = 'vite';
UPDATE `technologies` SET `icon` = 'mage:database' WHERE `slug` = 'sql';
UPDATE `technologies` SET `icon` = 'devicon-plain:githubactions' WHERE `slug` = 'github-actions';
UPDATE `technologies` SET `icon` = 'simple-icons:openai' WHERE `slug` = 'llm';
UPDATE `technologies` SET `icon` = 'simple-icons:firebase' WHERE `slug` = 'firebase';
UPDATE `technologies` SET `icon` = 'simple-icons:nodedotjs' WHERE `slug` = 'nodejs';
UPDATE `technologies` SET `icon` = 'simple-icons:deno' WHERE `slug` = 'deno';
UPDATE `technologies` SET `icon` = 'simple-icons:python' WHERE `slug` = 'python';
UPDATE `technologies` SET `icon` = 'simple-icons:postgresql' WHERE `slug` = 'postgresql';
UPDATE `technologies` SET `icon` = 'simple-icons:mongodb' WHERE `slug` = 'mongodb';
UPDATE `technologies` SET `icon` = 'mdi:api' WHERE `slug` = 'rest';
UPDATE `technologies` SET `icon` = 'simple-icons:graphql' WHERE `slug` = 'graphql';
UPDATE `technologies` SET `icon` = 'devicon-plain:java' WHERE `slug` = 'java';
UPDATE `technologies` SET `icon` = 'simple-icons:gradle' WHERE `slug` = 'gradle';
UPDATE `technologies` SET `icon` = 'mdi:window-shutter' WHERE `slug` = 'niri';
UPDATE `technologies` SET `icon` = 'mdi:console-line' WHERE `slug` = 'quickshell';
UPDATE `technologies` SET `icon` = 'simple-icons:qt' WHERE `slug` = 'qt-quick-qml';
UPDATE `technologies` SET `icon` = 'simple-icons:wayland' WHERE `slug` = 'wayland';
UPDATE `technologies` SET `icon` = 'mdi:home-cog' WHERE `slug` = 'home-manager';
UPDATE `technologies` SET `icon` = 'mdi:fish' WHERE `slug` = 'fish';
UPDATE `technologies` SET `icon` = 'mdi:folder-arrow-up-down' WHERE `slug` = 'direnv';

UPDATE `technologies` SET `featured` = 1 WHERE `slug` IN (
  'typescript', 'react', 'git', 'docker', 'dart', 'rust', 'tailwind', 'vue',
  'flutter', 'nodejs', 'deno', 'python', 'postgresql', 'mongodb', 'java',
  'graphql', 'linux', 'rest'
);
