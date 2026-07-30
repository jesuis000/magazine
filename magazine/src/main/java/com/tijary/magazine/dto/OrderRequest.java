package com.tijary.magazine.dto;

import java.util.List;

public class OrderRequest {
    public String phone;
    public String name;
    public String area;
    public String address;
    public String email;

    public String fulfillmentType; // "PICKUP" | "DELIVERY"
    public String deliverySlot;
    public String paymentMethod;
    public String notesText;
    public List<Item> items;

    public static class Item {
        public Long productId;
        public Integer quantity;
    }
}