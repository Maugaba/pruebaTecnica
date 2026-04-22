package com.pruebatecnica.users.security;

import com.pruebatecnica.users.entity.UserEntity;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class JwtService {

    private final JwtProperties props;

    private SecretKey key() {
        return Keys.hmacShaKeyFor(props.getSecret().getBytes(StandardCharsets.UTF_8));
    }

    public String generate(UserEntity user) {
        Date now = new Date();
        Date exp = new Date(now.getTime() + props.getExpirationMs());

        Map<String, Object> claims = new HashMap<>();
        claims.put("uid", user.getId());
        claims.put("email", user.getEmail());
        claims.put("name", user.getNombres() + " " + user.getApellidos());
        claims.put("rol", user.getRol() != null ? user.getRol().name() : "CLIENTE");

        return Jwts.builder()
                .claims(claims)
                .subject(String.valueOf(user.getId()))
                .issuer(props.getIssuer())
                .issuedAt(now)
                .expiration(exp)
                .signWith(key(), Jwts.SIG.HS256)
                .compact();
    }

    public Claims parse(String token) {
        return Jwts.parser()
                .verifyWith(key())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public long getExpirationMs() {
        return props.getExpirationMs();
    }
}
