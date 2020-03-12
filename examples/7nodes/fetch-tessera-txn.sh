#!/bin/bash

curl --unix-socket qdata/c1/tm.ipc --request GET  --url http://localhost:8080/receiveraw  --header 'c11n-key: TrsEgprNmS09BCLKkuS0y76oBWjc1h1LCZ5R8K+N1JDU/AnEdILV+WOCocr06zKg8ZRRmudR9ej2Rl47y3EPrw=='
