#!/bin/bash
mkdir -p $1
mkdir -p $1/female
mkdir -p $1/male

for i in `seq 1 97`;
do
  curl "https://randomuser.me/api/portraits/women/$i.jpg" > $1/female/$i.jpg
done  

for i in `seq 1 99`;
do
  curl "https://randomuser.me/api/portraits/men/$i.jpg" > $1/male/$i.jpg
done  