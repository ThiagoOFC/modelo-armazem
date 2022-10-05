package br.ufpa.castanhal.es2.armazem.repository;

import br.ufpa.castanhal.es2.armazem.domain.ProdutoCadastrado;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the ProdutoCadastrado entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ProdutoCadastradoRepository extends JpaRepository<ProdutoCadastrado, Long> {}
