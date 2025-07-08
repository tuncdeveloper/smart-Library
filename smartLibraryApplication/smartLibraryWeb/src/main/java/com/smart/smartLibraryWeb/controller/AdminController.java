package com.smart.smartLibraryWeb.controller;


import com.smart.smartLibraryWeb.dto.adminDTO.AdminDetailDTO;
import com.smart.smartLibraryWeb.dto.adminDTO.AdminLoginDTO;
import com.smart.smartLibraryWeb.service.adminSevice.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    // Admin login endpoint (POST)
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody AdminLoginDTO loginDTO) {
        boolean success = adminService.login(loginDTO);
        if (success) {
            return ResponseEntity.ok("Giriş başarılı");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Kullanıcı adı veya parola hatalı");
        }
    }

    // Kullanıcı adı ile admin profil bilgisi getirme (GET)
    @GetMapping("/profile/{username}")
    public ResponseEntity<AdminDetailDTO> getProfileByUsername(@PathVariable String username) {
        AdminDetailDTO adminDetail = adminService.getProfileByUsername(username);
        return ResponseEntity.ok(adminDetail);
    }
}
