(function() {
  $(function() {
    var calcGcd, gcd;
    calcGcd = function() {
      var a, b, c;
      a = $("a");
      b = $("b");
      c = $("c");
      return c.innerHTML = gcd(a, b);
    };
    return gcd = function(a, b) {
      if (b === 0) {
        return a;
      } else {
        return gcd(b, a % b);
      }
    };
  });
}).call(this);
