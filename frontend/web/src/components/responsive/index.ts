import React from "react";

// Responsive Layout Components
export {
  default as ResponsiveLayout,
  ResponsiveRow,
  ResponsiveCol,
  ResponsiveCenter,
  ResponsiveBetween,
} from "../ResponsiveLayout";
export {
  ResponsiveSidebarLayout,
  ResponsiveSplitLayout,
  ResponsiveMasonryLayout,
  ResponsiveStackLayout,
} from "../ResponsiveLayout";

// Responsive Container Components
export {
  default as ResponsiveContainer,
  ResponsiveContainerSm,
  ResponsiveContainerMd,
  ResponsiveContainerLg,
  ResponsiveContainerXl,
  ResponsiveContainer2xl,
  ResponsiveContainerFluid,
} from "../ResponsiveContainer";
export { ResponsiveSection, ResponsiveHero } from "../ResponsiveContainer";

// Responsive Grid Components
export {
  default as ResponsiveGrid,
  ResponsiveGrid2Col,
  ResponsiveGrid3Col,
  ResponsiveGrid4Col,
  ResponsiveAutoGrid,
} from "../ResponsiveGrid";

// Responsive Card Components
export {
  default as ResponsiveCard,
  ResponsiveCardElevated,
  ResponsiveCardOutlined,
  ResponsiveCardFilled,
  ResponsiveCardClickable,
} from "../ResponsiveCard";
export {
  ResponsiveCardWithHeader,
  ResponsiveCardGrid,
  ResponsiveCardList,
} from "../ResponsiveCard";

// Responsive Button Components
export { default as ResponsiveButton } from "../ResponsiveButton";

// Responsive Text Components
export {
  default as ResponsiveText,
  ResponsiveHeading1,
  ResponsiveHeading2,
  ResponsiveHeading3,
  ResponsiveHeading4,
} from "../ResponsiveText";
export {
  ResponsiveParagraph,
  ResponsiveSmall,
  ResponsiveCaption,
  ResponsiveTextCenter,
  ResponsiveTextRight,
} from "../ResponsiveText";
export {
  ResponsiveTextMuted,
  ResponsiveTextSecondary,
} from "../ResponsiveText";

// Responsive Form Components
export {
  default as ResponsiveForm,
  ResponsiveFormField,
  ResponsiveInput,
  ResponsiveTextarea,
  ResponsiveSelect,
} from "../ResponsiveForm";
export { ResponsiveFormActions } from "../ResponsiveForm";

// Responsive Navigation Components
export {
  default as ResponsiveNavigation,
  ResponsiveNavigationItem,
} from "../ResponsiveNavigation";
export {
  ResponsiveTabs,
  ResponsiveBreadcrumb,
  ResponsivePagination,
} from "../ResponsiveNavigation";

// Responsive Modal Components
export {
  default as ResponsiveModal,
  ResponsiveModalWithActions,
  ResponsiveConfirmationModal,
} from "../ResponsiveModal";
export { ResponsiveDrawerModal } from "../ResponsiveModal";

// Responsive Table Components
export {
  default as ResponsiveTable,
  ResponsiveTableHeader,
  ResponsiveTableCell,
  ResponsiveTableRow,
} from "../ResponsiveTable";
export {
  ResponsiveTableWithCards,
  ResponsiveTableWithExpandableRows,
  ResponsiveTableWithSelection,
} from "../ResponsiveTable";

// Responsive Image Component
export { default as ResponsiveImage } from "../ResponsiveImage";

// Responsive Utilities
export const responsiveUtils = {
  // Breakpoint utilities
  breakpoints: {
    xs: "475px",
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },

  // Responsive spacing
  spacing: {
    xs: "0.5rem",
    sm: "1rem",
    md: "1.5rem",
    lg: "2rem",
    xl: "3rem",
  },

  // Responsive typography
  typography: {
    xs: "0.75rem",
    sm: "0.875rem",
    base: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
  },
};

// Responsive context
export const ResponsiveContext = React.createContext({
  isMobile: false,
  isTablet: false,
  isDesktop: false,
});

export const ResponsiveProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isMobile, setIsMobile] = React.useState(false);
  const [isTablet, setIsTablet] = React.useState(false);
  const [isDesktop, setIsDesktop] = React.useState(false);

  React.useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
      setIsDesktop(width >= 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <ResponsiveContext.Provider value={{ isMobile, isTablet, isDesktop }}>
      {children}
    </ResponsiveContext.Provider>
  );
};

export const useResponsiveContext = () => {
  const context = React.useContext(ResponsiveContext);
  if (!context) {
    throw new Error(
      "useResponsiveContext must be used within a ResponsiveProvider"
    );
  }
  return context;
};
