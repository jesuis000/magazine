package com.tijary.magazine.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class SpaForwardController {

    // Matches any path that has no file extension (so real static files like
    // /assets/index-abc123.js, /images/x.jpg, /favicon.ico are left alone)
    // and isn't under /api — everything else is a client-side route.
    @RequestMapping(value = {
            "/{path:^(?!api|assets|images|uploads)[^\\.]*}",
            "/{path:^(?!api|assets|images|uploads)[^\\.]*}/**"
    })
    public String forward() {
        return "forward:/index.html";
    }
}