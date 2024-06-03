export const deliveryOptions = [{
  id: '1',
  days: 7,
  priceCents: 0
},
{
  id: '2',
  days: 3,
  priceCents: 499
}, {
  id: '3',
  days: 1,
  priceCents: 799
}];

export function getDeliveryId(deliveryId) {
  let matchingItem;
  deliveryOptions.forEach((option) => {
    if (option.id == deliveryId)
      matchingItem = option
  })
  return matchingItem;
}