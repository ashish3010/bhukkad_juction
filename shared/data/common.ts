/** Source of truth: `public/static/common.json` (also served at `/static/common.json`). Bundled at build time. */
import rawCommon from "../../public/static/common.json";

export const common = rawCommon as CommonCopy;

export type CommonCopy = {
  site: {
    name: string;
    title: string;
    description: string;
    keywords: string;
    jsonLdServesCuisine: string[];
    areaServedName: string;
    areaServedAlternateName: string;
  };
  nav: {
    home: string;
    categories: string;
    orders: string;
    cart: string;
    drawerMenuLabel: string;
    appearance: string;
    light: string;
    dark: string;
  };
  aria: {
    closeMenu: string;
    close: string;
    mainMenu: string;
    openMenu: string;
    homeLink: string;
    cart: string;
    cartWithCount: string;
    theme: string;
    quantity: string;
    decreaseQuantity: string;
    increaseQuantity: string;
    removeFromCart: string;
    quantityForProduct: string;
    editAddressKind: string;
  };
  home: {
    categoriesHeading: string;
    promoHero: {
      imageAlt: string;
      title: string;
      subtitle: string;
      orderNow: string;
    };
  };
  productCard: {
    addToCart: string;
  };
  cart: {
    yourSelection: string;
    emptyMessage: string;
    eachSuffix: string;
    total: string;
    continueToDelivery: string;
    backToMenu: string;
  };
  checkout: {
    stepCart: string;
    stepDelivery: string;
    receiverInfo: string;
    fullName: string;
    fullNamePlaceholder: string;
    contactNumber: string;
    phonePlaceholder: string;
    phoneHint: string;
    phoneInvalid: string;
    deliveryAddress: string;
    deliveryAddressSr: string;
    addressPlaceholder: string;
    addressKindHome: string;
    addressKindWork: string;
    addressKindOther: string;
    addressKindOtherWithLabel: string;
    otherLabel: string;
    otherLabelPlaceholder: string;
    saveAndPlaceOrder: string;
    savedOnDeviceNote: string;
    savedAddressesTitle: string;
    backToCart: string;
    savedAddressesBack: string;
    addNewAddress: string;
    defaultBadge: string;
    placeOrder: string;
    defaultDeliveryFootnote: string;
  };
  orderPlaced: {
    title: string;
    subtitle: string;
    orderIdLabel: string;
    deliveryTo: string;
    orderSummary: string;
    totalAmount: string;
    backToHome: string;
  };
  orderPlacing: {
    loadingPrimary: string;
    loadingSecondary: string;
    confirmedTitle: string;
    preparing: string;
    cod: string;
  };
  orders: {
    backToMenu: string;
    title: string;
    subtitle: string;
    emptyTitle: string;
    emptyBody: string;
    browseMenu: string;
    historyHeading: string;
    delivered: string;
    reorder: string;
  };
  telegram: {
    lineItem: string;
    newOrder: string;
    totalLine: string;
    customer: string;
    phone: string;
    deliverTo: string;
  };
  landing: {
    heroImageAlt: string;
    liveKitchen: string;
    title: string;
    tagline: string;
    description: string;
    logIn: string;
    alreadyMember: string;
    getStarted: string;
  };
};

/** Replace `{key}` placeholders in copy strings. */
export function replaceCopy(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(vars[key] ?? ""));
}
