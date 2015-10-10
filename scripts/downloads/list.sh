#!/bin/bash
mkdir -p $2

IFS=$'\n'
COUNTER=0

for j in `cat $1`
do

curl -o $2/$COUNTER.jpg $j
let COUNTER=COUNTER+1 

done
