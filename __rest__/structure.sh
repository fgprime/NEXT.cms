#!/bin/bash

http -v GET localhost:4000
http -v GET localhost:4000/structure
http -v GET localhost:4000/structure/rest
http -v POST localhost:4000/structure/rest note:='{"tool": "HTTPie"}'
http -v PUT localhost:4000/structure/rest note:='{"tool": "HTTPie"}'
http -v DELETE localhost:4000/structure/rest
