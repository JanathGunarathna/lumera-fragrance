package com.lumera.service;

import com.lumera.entity.Order;
import com.lumera.entity.OrderItem;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class PayHereService {

    @Value("${app.payhere.checkout-url}")
    private String checkoutUrl;

    @Value("${app.payhere.merchant-id}")
    private String merchantId;

    @Value("${app.payhere.merchant-secret}")
    private String merchantSecret;

    @Value("${app.payhere.currency:USD}")
    private String currency;

    @Value("${app.payhere.return-url}")
    private String returnUrlTemplate;

    @Value("${app.payhere.cancel-url}")
    private String cancelUrlTemplate;

    @Value("${app.payhere.notify-url}")
    private String notifyUrl;

    public Map<String, String> createCheckout(Order order) {
        requireConfiguration();

        String orderId = String.valueOf(order.getId());
        String amount = order.getTotalAmount().setScale(2, RoundingMode.HALF_UP).toPlainString();
        String hash = generateCheckoutHash(merchantId, orderId, amount, currency, merchantSecret);

        String[] name = splitName(order.getUser().getFullName());

        Map<String, String> form = new LinkedHashMap<>();
        form.put("merchant_id", merchantId);
        form.put("return_url", returnUrlTemplate.replace("{orderId}", orderId));
        form.put("cancel_url", cancelUrlTemplate.replace("{orderId}", orderId));
        form.put("notify_url", notifyUrl);
        form.put("first_name", name[0]);
        form.put("last_name", name[1]);
        form.put("email", order.getUser().getEmail());
        form.put("phone", safe(order.getShippingPhone(), order.getUser().getPhone(), "0000000000"));
        form.put("address", safe(order.getShippingAddress(), order.getUser().getAddress(), "Sri Lanka"));
        form.put("city", "Sri Lanka");
        form.put("country", "Sri Lanka");
        form.put("order_id", orderId);
        form.put("items", buildItemSummary(order));
        form.put("currency", currency);
        form.put("amount", amount);
        form.put("hash", hash);
        return form;
    }

    public String getCheckoutUrl() {
        return checkoutUrl;
    }

    public boolean verifyNotification(String notificationMerchantId,
                                      String orderId,
                                      String amount,
                                      String notificationCurrency,
                                      String statusCode,
                                      String md5sig) {
        if (isBlank(merchantSecret) || !merchantId.equals(notificationMerchantId)) {
            return false;
        }

        String local = md5Upper(
                notificationMerchantId
                        + orderId
                        + amount
                        + notificationCurrency
                        + statusCode
                        + md5Upper(merchantSecret)
        );

        return MessageDigest.isEqual(
                local.getBytes(StandardCharsets.UTF_8),
                safe(md5sig, "", "").getBytes(StandardCharsets.UTF_8)
        );
    }

    public boolean amountMatches(Order order, String amount, String notificationCurrency) {
        if (!currency.equalsIgnoreCase(notificationCurrency) || amount == null) {
            return false;
        }
        try {
            return order.getTotalAmount().compareTo(new BigDecimal(amount)) == 0;
        } catch (NumberFormatException ex) {
            return false;
        }
    }

    private String generateCheckoutHash(String merchantId, String orderId, String amount,
                                        String currency, String secret) {
        return md5Upper(merchantId + orderId + amount + currency + md5Upper(secret));
    }

    private String md5Upper(String value) {
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] digest = md.digest(value.getBytes(StandardCharsets.UTF_8));
            StringBuilder out = new StringBuilder(digest.length * 2);
            for (byte b : digest) {
                out.append(String.format("%02X", b));
            }
            return out.toString();
        } catch (Exception ex) {
            throw new IllegalStateException("Unable to generate payment hash", ex);
        }
    }

    private String buildItemSummary(Order order) {
        String summary = order.getItems().stream()
                .limit(3)
                .map(OrderItem::getProductName)
                .collect(Collectors.joining(", "));
        return summary.isBlank() ? "Lumera Fragrance Order" : summary;
    }

    private String[] splitName(String fullName) {
        String cleaned = safe(fullName, "", "Customer").trim();
        if (cleaned.isBlank()) {
            return new String[]{"Customer", "Customer"};
        }
        int space = cleaned.indexOf(' ');
        if (space < 0) {
            return new String[]{cleaned, "Customer"};
        }
        return new String[]{cleaned.substring(0, space), cleaned.substring(space + 1).trim()};
    }

    private String safe(String primary, String secondary, String fallback) {
        if (!isBlank(primary)) return primary;
        if (!isBlank(secondary)) return secondary;
        return fallback;
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }

    private void requireConfiguration() {
        if (isBlank(merchantId) || isBlank(merchantSecret)) {
            throw new IllegalStateException(
                    "PayHere is not configured. Set PAYHERE_MERCHANT_ID and PAYHERE_MERCHANT_SECRET."
            );
        }
    }
}
