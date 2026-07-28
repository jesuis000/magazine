package com.tijary.magazine.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "banners")
@Getter
@Setter
public class Banner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long storeId;

    @Column(columnDefinition = "TEXT")
    private String imageUrl;

    private String linkUrl; // optional — where tapping the banner goes (e.g. a category)

    private Integer sortOrder = 0;
}
