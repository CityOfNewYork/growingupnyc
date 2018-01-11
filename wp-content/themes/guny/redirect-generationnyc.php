<?php

global $params;

$endpoint = $params['endpoint'];

header("Location: /generationnyc/$endpoint", true, 301);