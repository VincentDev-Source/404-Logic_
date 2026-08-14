<?php

return [
    'version' => 'city-priority-v0-demo',
    'minimum_factor_coverage' => 0.60,

    'factor_weights' => [
        'severity' => 0.30,
        'population_impact' => 0.20,
        'facility_proximity' => 0.15,
        'environmental_risk' => 0.15,
        'report_count' => 0.10,
        'confirmation_count' => 0.05,
        'historical_frequency' => 0.05,
    ],

    'levels' => [
        'low' => [0, 25],
        'medium' => [25, 50],
        'high' => [50, 75],
        'critical' => [75, 100],
    ],

    'facility_rules' => [],
    'hazard_rules' => [],
];
