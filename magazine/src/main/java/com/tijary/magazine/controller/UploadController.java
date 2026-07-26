package com.tijary.magazine.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/uploads")
public class UploadController {

    private static final String UPLOAD_DIR = "data/uploads/voice-notes";

    @PostMapping("/voice-notes")
    public ResponseEntity<Map<String, String>> uploadVoiceNote(@RequestParam("file") MultipartFile file) throws IOException {
        Path dir = Paths.get(UPLOAD_DIR);
        Files.createDirectories(dir);

        String filename = UUID.randomUUID() + ".webm";
        Path target = dir.resolve(filename);
        file.transferTo(target);

        return ResponseEntity.ok(Map.of("url", "/uploads/voice-notes/" + filename));
    }
}
