package com.tastycuisine.TastyCuisineV2.controller;

import com.tastycuisine.TastyCuisineV2.model.entity.Chefe;
import com.tastycuisine.TastyCuisineV2.model.entity.Usuario;
import com.tastycuisine.TastyCuisineV2.model.repository.ChefeRepository;
import com.tastycuisine.TastyCuisineV2.model.repository.UsuarioRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ChefeRepository chefeRepository;

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration-ms:86400000}")
    private long jwtExpirationMs;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        String email = req.getEmail();
        String password = req.getPassword();
        String role = req.getRole();

        if (role == null) role = "usuario";

        if ("usuario".equalsIgnoreCase(role)) {
            Optional<Usuario> op = usuarioRepository.findByGmail(email);
            if (op.isEmpty() || !op.get().getSenha().equals(password)) {
                return ResponseEntity.status(401).body(Map.of("error", "Credenciais inválidas"));
            }
            Usuario u = op.get();
            String token = generateToken(String.valueOf(u.getCodUser()), "usuario", u.getNomeCompleto());
            return ResponseEntity.ok(new LoginResponse(token, Map.of(
                    "id", u.getCodUser(),
                    "name", u.getNomeCompleto(),
                    "email", u.getGmail(),
                    "age", u.getIdade(),
                    "role", "usuario"
            )));
        } else if ("chef".equalsIgnoreCase(role) || "chefe".equalsIgnoreCase(role)) {
            Optional<Chefe> op = chefeRepository.findByGmail(email);
            if (op.isEmpty() || !op.get().getSenha().equals(password)) {
                return ResponseEntity.status(401).body(Map.of("error", "Credenciais inválidas"));
            }
            Chefe c = op.get();
            String token = generateToken(String.valueOf(c.getCodChefe()), "chef", c.getNomeUsuario());
            return ResponseEntity.ok(new LoginResponse(token, Map.of(
                    "id", c.getCodChefe(),
                    "name", c.getNomeUsuario(),
                    "fullName", c.getNomeCompleto(),
                    "email", c.getGmail(),
                    "age", c.getIdade(),
                    "role", "chef"
            )));
        } else {
            return ResponseEntity.badRequest().body(Map.of("error", "Role inválida"));
        }
    }

    private String generateToken(String subject, String role, String username) {
        Key key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
        return Jwts.builder()
                .setSubject(subject)
                .claim("role", role)
                .claim("username", username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }
}
