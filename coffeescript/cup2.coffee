gcd = (a,b) ->
	alert "gcd(#{a}, #{b})"
	if (b==0) then a else gcd(b, a % b)

$("#button").click -> 
	$("#c").innerHTML  = gcd($("#a"), $("#b"))