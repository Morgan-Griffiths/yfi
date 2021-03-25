export function sortAddresses(addresses, weights) {
  //1) combine the arrays:
  var list = [];
  for (var j = 0; j < addresses.length; j++)
    list.push({ address: addresses[j], weight: weights[j] });

  //2) sort:
  list.sort(function (a, b) {
    return a.address < b.address ? -1 : a.address == b.address ? 0 : 1;
  });

  //3) separate them back out:
  for (var k = 0; k < list.length; k++) {
    addresses[k] = list[k].address;
    weights[k] = list[k].weight;
  }
  return addresses, weights;
}
