import React, { useState } from "react";
import { useResponsive } from "../hooks/useResponsive";
import {
  ResponsiveLayout,
  ResponsiveContainer,
  ResponsiveGrid,
  ResponsiveCard,
  ResponsiveButton,
  ResponsiveText,
  ResponsiveForm,
  ResponsiveInput,
  ResponsiveNavigation,
  ResponsiveTabs,
  ResponsiveModal,
  ResponsiveTable,
  ResponsiveTableHeader,
  ResponsiveTableCell,
  ResponsiveTableRow,
} from "../components/responsive";

export default function ResponsiveExample() {
  const { isMobile, isTablet, isDesktop, screenSize } = useResponsive();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("tab1");

  const tabs = [
    {
      id: "tab1",
      label: "Responsive Layout",
      content: (
        <div className="space-y-6">
          <ResponsiveText variant="h2" size="2xl" weight="bold">
            Responsive Layout Examples
          </ResponsiveText>

          <ResponsiveGrid cols={{ mobile: 1, tablet: 2, desktop: 3 }}>
            <ResponsiveCard variant="elevated">
              <ResponsiveText variant="h3" size="lg" weight="semibold">
                Card 1
              </ResponsiveText>
              <ResponsiveText size="sm" color="muted">
                This card adapts to different screen sizes
              </ResponsiveText>
            </ResponsiveCard>

            <ResponsiveCard variant="elevated">
              <ResponsiveText variant="h3" size="lg" weight="semibold">
                Card 2
              </ResponsiveText>
              <ResponsiveText size="sm" color="muted">
                Responsive grid layout example
              </ResponsiveText>
            </ResponsiveCard>

            <ResponsiveCard variant="elevated">
              <ResponsiveText variant="h3" size="lg" weight="semibold">
                Card 3
              </ResponsiveText>
              <ResponsiveText size="sm" color="muted">
                Mobile-first design approach
              </ResponsiveText>
            </ResponsiveCard>
          </ResponsiveGrid>
        </div>
      ),
    },
    {
      id: "tab2",
      label: "Responsive Form",
      content: (
        <div className="space-y-6">
          <ResponsiveText variant="h2" size="2xl" weight="bold">
            Responsive Form Example
          </ResponsiveText>

          <ResponsiveForm layout="vertical" spacing="md">
            <ResponsiveInput
              label="Full Name"
              name="name"
              placeholder="Enter your full name"
              required
            />

            <ResponsiveInput
              label="Email Address"
              name="email"
              type="email"
              placeholder="Enter your email"
              required
            />

            <ResponsiveInput
              label="Phone Number"
              name="phone"
              type="tel"
              placeholder="Enter your phone number"
            />

            <ResponsiveLayout direction="row" gap="md" align="center">
              <ResponsiveButton variant="primary" fullWidth>
                Submit
              </ResponsiveButton>
              <ResponsiveButton variant="secondary" fullWidth>
                Cancel
              </ResponsiveButton>
            </ResponsiveLayout>
          </ResponsiveForm>
        </div>
      ),
    },
    {
      id: "tab3",
      label: "Responsive Table",
      content: (
        <div className="space-y-6">
          <ResponsiveText variant="h2" size="2xl" weight="bold">
            Responsive Table Example
          </ResponsiveText>

          <ResponsiveTable variant="striped">
            <thead>
              <tr>
                <ResponsiveTableHeader>Name</ResponsiveTableHeader>
                <ResponsiveTableHeader>Email</ResponsiveTableHeader>
                <ResponsiveTableHeader>Role</ResponsiveTableHeader>
                <ResponsiveTableHeader>Status</ResponsiveTableHeader>
              </tr>
            </thead>
            <tbody>
              <ResponsiveTableRow>
                <ResponsiveTableCell>John Doe</ResponsiveTableCell>
                <ResponsiveTableCell>john@example.com</ResponsiveTableCell>
                <ResponsiveTableCell>Developer</ResponsiveTableCell>
                <ResponsiveTableCell>
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                    Active
                  </span>
                </ResponsiveTableCell>
              </ResponsiveTableRow>
              <ResponsiveTableRow>
                <ResponsiveTableCell>Jane Smith</ResponsiveTableCell>
                <ResponsiveTableCell>jane@example.com</ResponsiveTableCell>
                <ResponsiveTableCell>Designer</ResponsiveTableCell>
                <ResponsiveTableCell>
                  <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                    Pending
                  </span>
                </ResponsiveTableCell>
              </ResponsiveTableRow>
              <ResponsiveTableRow>
                <ResponsiveTableCell>Bob Johnson</ResponsiveTableCell>
                <ResponsiveTableCell>bob@example.com</ResponsiveTableCell>
                <ResponsiveTableCell>Manager</ResponsiveTableCell>
                <ResponsiveTableCell>
                  <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                    Inactive
                  </span>
                </ResponsiveTableCell>
              </ResponsiveTableRow>
            </tbody>
          </ResponsiveTable>
        </div>
      ),
    },
  ];

  return (
    <ResponsiveContainer maxWidth="xl" padding="lg">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <ResponsiveText
            variant="h1"
            size="4xl"
            weight="bold"
            className="mb-4"
          >
            Responsive Design System
          </ResponsiveText>
          <ResponsiveText size="lg" color="muted">
            Current screen size: {screenSize} (
            {isMobile ? "Mobile" : isTablet ? "Tablet" : "Desktop"})
          </ResponsiveText>
        </div>

        {/* Navigation */}
        <ResponsiveNavigation variant="header">
          <div className="flex items-center space-x-4">
            <ResponsiveText variant="h3" size="lg" weight="semibold">
              Examples
            </ResponsiveText>
            <ResponsiveButton
              variant="primary"
              onClick={() => setIsModalOpen(true)}
            >
              Open Modal
            </ResponsiveButton>
          </div>
        </ResponsiveNavigation>

        {/* Tabs */}
        <ResponsiveTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          variant="pills"
        />

        {/* Responsive Layout Examples */}
        <div className="space-y-6">
          <ResponsiveText variant="h2" size="2xl" weight="bold">
            Layout Examples
          </ResponsiveText>

          {/* Responsive Row/Col */}
          <ResponsiveLayout direction="row" gap="lg" align="center">
            <ResponsiveCard variant="outlined" className="flex-1">
              <ResponsiveText variant="h3" size="lg" weight="semibold">
                Left Column
              </ResponsiveText>
              <ResponsiveText size="sm" color="muted">
                This column adapts to screen size
              </ResponsiveText>
            </ResponsiveCard>

            <ResponsiveCard variant="outlined" className="flex-1">
              <ResponsiveText variant="h3" size="lg" weight="semibold">
                Right Column
              </ResponsiveText>
              <ResponsiveText size="sm" color="muted">
                Responsive layout example
              </ResponsiveText>
            </ResponsiveCard>
          </ResponsiveLayout>

          {/* Responsive Grid */}
          <ResponsiveGrid cols={{ mobile: 1, tablet: 2, desktop: 4 }}>
            <ResponsiveCard variant="filled">
              <div className="text-center">
                <ResponsiveText
                  variant="h3"
                  size="xl"
                  weight="bold"
                  color="primary"
                >
                  1
                </ResponsiveText>
                <ResponsiveText size="sm" color="muted">
                  Grid Item
                </ResponsiveText>
              </div>
            </ResponsiveCard>

            <ResponsiveCard variant="filled">
              <div className="text-center">
                <ResponsiveText
                  variant="h3"
                  size="xl"
                  weight="bold"
                  color="primary"
                >
                  2
                </ResponsiveText>
                <ResponsiveText size="sm" color="muted">
                  Grid Item
                </ResponsiveText>
              </div>
            </ResponsiveCard>

            <ResponsiveCard variant="filled">
              <div className="text-center">
                <ResponsiveText
                  variant="h3"
                  size="xl"
                  weight="bold"
                  color="primary"
                >
                  3
                </ResponsiveText>
                <ResponsiveText size="sm" color="muted">
                  Grid Item
                </ResponsiveText>
              </div>
            </ResponsiveCard>

            <ResponsiveCard variant="filled">
              <div className="text-center">
                <ResponsiveText
                  variant="h3"
                  size="xl"
                  weight="bold"
                  color="primary"
                >
                  4
                </ResponsiveText>
                <ResponsiveText size="sm" color="muted">
                  Grid Item
                </ResponsiveText>
              </div>
            </ResponsiveCard>
          </ResponsiveGrid>
        </div>

        {/* Responsive Modal */}
        <ResponsiveModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Responsive Modal Example"
          size="md"
        >
          <div className="space-y-4">
            <ResponsiveText>
              This is a responsive modal that adapts to different screen sizes.
            </ResponsiveText>

            <ResponsiveLayout direction="row" gap="md" align="center">
              <ResponsiveButton
                variant="primary"
                onClick={() => setIsModalOpen(false)}
                fullWidth
              >
                Close
              </ResponsiveButton>
              <ResponsiveButton
                variant="secondary"
                onClick={() => alert("Action performed!")}
                fullWidth
              >
                Action
              </ResponsiveButton>
            </ResponsiveLayout>
          </div>
        </ResponsiveModal>
      </div>
    </ResponsiveContainer>
  );
}
