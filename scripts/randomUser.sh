#!/bin/bash
mkdir -p $1
mkdir -p $1/$2

while : 
do
	
	wget -nd -H -p -A jpg,jpeg,png,gif -e robots=off -P $1/$2 "http://www.designskilz.com/random-users/assets/new-$2-user.php"
	
done
