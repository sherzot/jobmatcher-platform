# Responsive Design System

Bu dokumentatsiya Jobmatcher platformasining responsive dizayn tizimi haqida ma'lumot beradi.

## Breakpoints

Platforma quyidagi breakpointlarni qo'llab-quvvatlaydi:

- **xs**: 475px (kichik telefonlar)
- **sm**: 640px (katta telefonlar)
- **md**: 768px (tabletlar)
- **lg**: 1024px (kichik kompyuterlar)
- **xl**: 1280px (katta kompyuterlar)
- **2xl**: 1536px (juda katta ekranlar)

## Responsive Komponentlar

### ResponsiveLayout

Asosiy layout komponenti:

```tsx
import { ResponsiveLayout, ResponsiveRow, ResponsiveCol } from '../components/responsive';

// Asosiy layout
<ResponsiveLayout direction="row" gap="md" align="center">
  <div>Content</div>
</ResponsiveLayout>

// Predefined layouts
<ResponsiveRow>
  <div>Left</div>
  <div>Right</div>
</ResponsiveRow>

<ResponsiveCol>
  <div>Top</div>
  <div>Bottom</div>
</ResponsiveCol>
```

### ResponsiveContainer

Container komponentlari:

```tsx
import { ResponsiveContainer, ResponsiveContainerMd } from '../components/responsive';

// Asosiy container
<ResponsiveContainer maxWidth="xl" padding="md">
  <div>Content</div>
</ResponsiveContainer>

// Predefined containers
<ResponsiveContainerMd>
  <div>Medium width content</div>
</ResponsiveContainerMd>
```

### ResponsiveGrid

Grid layout komponentlari:

```tsx
import { ResponsiveGrid, ResponsiveGrid3Col } from '../components/responsive';

// Asosiy grid
<ResponsiveGrid cols={{ mobile: 1, tablet: 2, desktop: 3 }}>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</ResponsiveGrid>

// Predefined grids
<ResponsiveGrid3Col>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</ResponsiveGrid3Col>
```

### ResponsiveCard

Card komponentlari:

```tsx
import { ResponsiveCard, ResponsiveCardWithHeader } from '../components/responsive';

// Asosiy card
<ResponsiveCard variant="elevated" padding="lg">
  <div>Card content</div>
</ResponsiveCard>

// Card with header
<ResponsiveCardWithHeader title="Card Title" subtitle="Card subtitle">
  <div>Card content</div>
</ResponsiveCardWithHeader>
```

### ResponsiveButton

Button komponenti:

```tsx
import { ResponsiveButton } from '../components/responsive';

<ResponsiveButton 
  variant="primary" 
  size="md" 
  fullWidth={false}
  loading={false}
>
  Click me
</ResponsiveButton>
```

### ResponsiveText

Text komponentlari:

```tsx
import { ResponsiveText, ResponsiveHeading1 } from '../components/responsive';

// Asosiy text
<ResponsiveText size="lg" weight="semibold" color="primary">
  Responsive text
</ResponsiveText>

// Predefined headings
<ResponsiveHeading1>Main Heading</ResponsiveHeading1>
```

### ResponsiveForm

Form komponentlari:

```tsx
import { ResponsiveForm, ResponsiveInput } from '../components/responsive';

<ResponsiveForm layout="vertical" spacing="md">
  <ResponsiveInput
    label="Email"
    name="email"
    type="email"
    required
  />
  <ResponsiveInput
    label="Password"
    name="password"
    type="password"
    required
  />
</ResponsiveForm>
```

### ResponsiveNavigation

Navigation komponentlari:

```tsx
import { ResponsiveNavigation, ResponsiveTabs } from '../components/responsive';

// Asosiy navigation
<ResponsiveNavigation variant="header">
  <ResponsiveNavigationItem href="/" active>Home</ResponsiveNavigationItem>
  <ResponsiveNavigationItem href="/about">About</ResponsiveNavigationItem>
</ResponsiveNavigation>

// Tabs
<ResponsiveTabs
  tabs={[
    { id: 'tab1', label: 'Tab 1', content: <div>Content 1</div> },
    { id: 'tab2', label: 'Tab 2', content: <div>Content 2</div> }
  ]}
  activeTab="tab1"
  onTabChange={setActiveTab}
/>
```

### ResponsiveModal

Modal komponentlari:

```tsx
import { ResponsiveModal, ResponsiveConfirmationModal } from '../components/responsive';

// Asosiy modal
<ResponsiveModal
  isOpen={isOpen}
  onClose={onClose}
  title="Modal Title"
  size="md"
>
  <div>Modal content</div>
</ResponsiveModal>

// Confirmation modal
<ResponsiveConfirmationModal
  isOpen={isOpen}
  onClose={onClose}
  onConfirm={handleConfirm}
  title="Confirm Action"
  message="Are you sure you want to proceed?"
  variant="danger"
/>
```

### ResponsiveTable

Table komponentlari:

```tsx
import { ResponsiveTable, ResponsiveTableWithCards } from '../components/responsive';

// Asosiy table
<ResponsiveTable variant="striped">
  <thead>
    <tr>
      <ResponsiveTableHeader>Name</ResponsiveTableHeader>
      <ResponsiveTableHeader>Email</ResponsiveTableHeader>
    </tr>
  </thead>
  <tbody>
    <ResponsiveTableRow>
      <ResponsiveTableCell>John Doe</ResponsiveTableCell>
      <ResponsiveTableCell>john@example.com</ResponsiveTableCell>
    </ResponsiveTableRow>
  </tbody>
</ResponsiveTable>

// Table with mobile cards
<ResponsiveTableWithCards
  data={data}
  columns={[
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' }
  ]}
/>
```

## Responsive Hooks

### useResponsive

Asosiy responsive hook:

```tsx
import { useResponsive } from '../hooks/useResponsive';

function MyComponent() {
  const { 
    isMobile, 
    isTablet, 
    isDesktop, 
    screenSize,
    width,
    height 
  } = useResponsive();

  return (
    <div>
      {isMobile && <MobileView />}
      {isTablet && <TabletView />}
      {isDesktop && <DesktopView />}
    </div>
  );
}
```

### useResponsiveValue

Responsive qiymatlar uchun hook:

```tsx
import { useResponsiveValue } from '../hooks/useResponsive';

function MyComponent() {
  const fontSize = useResponsiveValue('14px', '16px', '18px', '20px');
  const columns = useResponsiveValue(1, 2, 3, 4);

  return (
    <div style={{ fontSize }}>
      <ResponsiveGrid cols={{ mobile: 1, tablet: 2, desktop: columns }}>
        {/* Content */}
      </ResponsiveGrid>
    </div>
  );
}
```

## Responsive Utilities

### responsiveClasses

Responsive CSS classlari yaratish:

```tsx
import { responsiveClasses } from '../utils/responsive';

const gridClasses = responsiveClasses.grid.cols({
  xs: 1,
  sm: 2,
  md: 3,
  lg: 4,
  xl: 5,
  '2xl': 6
});

const spacingClasses = responsiveClasses.spacing.padding({
  xs: 2,
  sm: 4,
  md: 6,
  lg: 8,
  xl: 10,
  '2xl': 12
});
```

### responsiveValue

Responsive qiymatlar bilan ishlash:

```tsx
import { responsiveValue } from '../utils/responsive';

const values = {
  xs: 'small',
  sm: 'medium',
  md: 'large',
  lg: 'xlarge',
  xl: 'xxlarge',
  '2xl': 'xxxlarge'
};

const currentValue = responsiveValue.get(values, 'md'); // 'large'
```

## Responsive CSS Classes

Platforma quyidagi responsive CSS classlarini qo'llab-quvvatlaydi:

### Grid
- `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- `gap-4 sm:gap-6 lg:gap-8`

### Spacing
- `p-4 sm:p-6 lg:p-8`
- `m-4 sm:m-6 lg:m-8`
- `space-y-4 sm:space-y-6 lg:space-y-8`

### Typography
- `text-sm sm:text-base lg:text-lg`
- `text-xs sm:text-sm lg:text-base`

### Layout
- `flex flex-col sm:flex-row`
- `justify-center sm:justify-start`
- `items-center sm:items-start`

### Display
- `hidden sm:block`
- `block sm:hidden`
- `lg:hidden`

## Responsive Best Practices

### 1. Mobile-First Approach
Har doim mobile dizayn bilan boshlang va keyin katta ekranlar uchun qo'shimchalar qo'shing.

### 2. Flexible Grids
Grid layoutlarda responsive columnlar ishlatish:

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Content */}
</div>
```

### 3. Responsive Images
Rasmlar uchun responsive classlar ishlatish:

```tsx
<img 
  src="image.jpg" 
  className="w-full h-auto max-w-full" 
  alt="Responsive image" 
/>
```

### 4. Touch-Friendly Buttons
Mobile qurilmalar uchun katta buttonlar:

```tsx
<button className="min-h-[44px] min-w-[44px] px-4 py-2">
  Touch me
</button>
```

### 5. Responsive Typography
Matn o'lchamlarini responsive qilish:

```tsx
<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
  Responsive Heading
</h1>
```

## Responsive Testing

### Browser Developer Tools
- Chrome DevTools da responsive mode ishlatish
- Turli qurilma o'lchamlarini test qilish
- Orientation test qilish

### Real Devices
- Haqiqiy mobile qurilmalarda test qilish
- Turli browserlarda test qilish
- Performance test qilish

## Responsive Performance

### 1. Optimize Images
- WebP format ishlatish
- Responsive images ishlatish
- Lazy loading qo'llash

### 2. Minimize CSS
- Unused CSS classlarni o'chirish
- CSS minification qilish
- Critical CSS inline qilish

### 3. Optimize JavaScript
- Code splitting qilish
- Lazy loading qo'llash
- Bundle size optimizatsiya qilish

## Responsive Accessibility

### 1. Touch Targets
- Minimum 44x44px touch target
- Adequate spacing between elements
- Clear visual feedback

### 2. Typography
- Minimum 16px font size
- Adequate line height
- Good contrast ratio

### 3. Navigation
- Clear navigation structure
- Accessible menu items
- Keyboard navigation support

## Responsive SEO

### 1. Mobile-Friendly
- Google Mobile-Friendly Test
- Page speed optimization
- Mobile-first indexing

### 2. Structured Data
- Responsive structured data
- Mobile-specific markup
- AMP pages (if needed)

## Responsive Analytics

### 1. Screen Size Tracking
- User screen sizes
- Device types
- Browser information

### 2. Performance Monitoring
- Page load times
- Core Web Vitals
- User experience metrics

Bu dokumentatsiya responsive dizayn tizimining asosiy qismlarini qamrab oladi. Qo'shimcha savollar uchun development jamoasi bilan bog'laning.
