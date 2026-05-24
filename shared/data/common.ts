/**
 * Bundled fallback: `public/static/common.json` (also at `/static/common.json`).
 * UI copy loads remotely in the browser when `CommonCopyProvider` is used; this stays the offline fallback.
 */
import rawCommon from "../../public/static/common.json";

export const commonLocal = rawCommon as CommonCopy;

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
  headerTopBar: {
    tagline: string;
    orderPrefix: string;
    phoneDisplay: string;
    phoneTel: string;
  };
  nav: {
    home: string;
    ourStory: string;
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
    bestsellerBadge: string;
  };
  cart: {
    yourSelection: string;
    emptyMessage: string;
    eachSuffix: string;
    total: string;
    continueToDelivery: string;
    backToMenu: string;
    browseMenu: string;
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
    orderNoteOptional: string;
    orderNotePlaceholder: string;
  };
  orderPlaced: {
    title: string;
    subtitle: string;
    orderIdLabel: string;
    deliveryTo: string;
    orderSummary: string;
    subtotal: string;
    deliveryCharge: string;
    taxesFees: string;
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
    delivered: string;
    reorder: string;
    viewMore: string;
    viewLess: string;
  };
  telegram: {
    lineItem: string;
    newOrder: string;
    subtotalLine: string;
    deliveryLine: string;
    taxesLine: string;
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
  desktop: {
    nav: {
      menu: string;
    };
    ourStoryPage: {
      documentTitle: string;
    };
    hero: {
      eyebrow: string;
      headingLine1: string;
      headingLine2: string;
      body: string;
      exploreMenu: string;
      ourStory: string;
    };
    ourStorySection: {
      block1Title: string;
      block1Body: string;
      block2Title: string;
      block2Paragraph1: string;
      block2Paragraph2: string;
      mapHeading: string;
      mapOpenExternal: string;
      reviewsHeading: string;
      reviews: { stars: number; quote: string; name: string }[];
    };
    explore: {
      title: string;
      tagline: string;
      filtersTitle: string;
      filtersSubtitle: string;
      filterAll: string;
      quickAdd: string;
    };
    ordersDashboard: {
      pageTitle: string;
      pageSubtitle: string;
      browseMenu: string;
      colDate: string;
      colItems: string;
      colStatus: string;
      colTotal: string;
      colActions: string;
      viewAllOrders: string;
    };
    cartPage: {
      summaryAsideTitle: string;
    };
    finalize: {
      pageTitle: string;
      pageSubtitle: string;
      deliveryDetails: string;
      paymentMethod: string;
      orderSummary: string;
      payWhatsappTitle: string;
      payWhatsappSubtitle: string;
      payCardTitle: string;
      payCardSubtitle: string;
      payCodTitle: string;
      payCodSubtitle: string;
      paymentComingSoon: string;
      secureNote: string;
      proceedWhatsapp: string;
      lineOptionLabel: string;
      lineItemEdit: string;
      editCart: string;
      couponCode: string;
      couponApply: string;
      couponHint: string;
      tastesCaption: string;
      tastesImageAlt: string;
    };
  };
};

/** Replace `{key}` placeholders in copy strings. */
export function replaceCopy(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(vars[key] ?? ""));
}
