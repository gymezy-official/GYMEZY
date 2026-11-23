Test Case ID:     AUT_UI_BAN_001
Title:            [P2|Functional] Super Admin creates a priority banner
Severity:         S2 Critical
Steps Run:
1. Open https://dev.admin.gymezy.com/admin/banners
2. Click btn-add-banner
3. Enter title Diwali Offer
4. Upload offer.jpg
5. Turn on banner-priority
6. Click banner-submit

Expected Result:
• New row appears with Priority tag
• Preview image src starts with 'data:image/webp;base64'
• Success toast is shown

Actual Result:
TimeoutError: waiting for locator('[data-testid=\'btn-add-banner\']') timed out after 10000ms. On /admin/banners, the button is rendered with text "Create New Banner" but without the specified data-testid="btn-add-banner" attribute.

Evidence:
Locator: locator('[data-testid=\'btn-add-banner\']')
Console Output:
TimeoutError: locator.click: Timeout 10000ms exceeded.
Screenshot: gymezy_testing/test-results/AUT_UI_BAN_001-Banners-Ads-1e45a-iority-banner-P2-Regression-super-admin/test-failed-1.png

Suspected Cause:
In web-application/super-admin/src/admin/BannerManagement.jsx:
1. Trigger Button (lines 800-830): The button `<Button type="primary" icon={<PlusOutlined />} onClick={...}>Create New Banner</Button>` lacks `data-testid="btn-add-banner"`.
2. Form Modal Inputs:
   - Title input lacks `data-testid="banner-title"`.
   - File upload input lacks `data-testid="banner-image"`.
   - Priority toggle switch lacks `data-testid="banner-priority"`.
   - Modal submission button lacks `data-testid="banner-submit"`.
3. Table Row Render:
   - Ensure the newly created banner row includes class `.ant-table-row` with Ant Design tag showing 'Priority'.
