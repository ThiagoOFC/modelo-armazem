package br.ufpa.castanhal.es2.armazem.repository;

import br.ufpa.castanhal.es2.armazem.domain.Authority;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Spring Data JPA repository for the {@link Authority} entity.
 */
public interface AuthorityRepository extends JpaRepository<Authority, String> {}
