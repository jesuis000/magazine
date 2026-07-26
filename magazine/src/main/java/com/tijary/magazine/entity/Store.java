package com.tijary.magazine.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "stores")
@Getter
@Setter
public class Store {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String slug;

    @Column(nullable = false)
    private String name;

    private String logoUrl;

    private String themeColor;

    private String currency;

    private String phone;

    @ElementCollection
    @CollectionTable(name = "store_delivery_zones", joinColumns = @JoinColumn(name = "store_id"))
    @Column(name = "zone_name")
    private List<String> deliveryZones = new ArrayList<>();

    @ElementCollection(targetClass = PaymentMethod.class)
    @CollectionTable(name = "store_payment_methods", joinColumns = @JoinColumn(name = "store_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "method")
    private List<PaymentMethod> paymentMethods = new ArrayList<>();


}
