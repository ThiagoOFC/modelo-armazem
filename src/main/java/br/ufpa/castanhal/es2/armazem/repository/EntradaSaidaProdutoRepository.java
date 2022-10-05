package br.ufpa.castanhal.es2.armazem.repository;

import br.ufpa.castanhal.es2.armazem.domain.EntradaSaidaProduto;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the EntradaSaidaProduto entity.
 */
@Repository
public interface EntradaSaidaProdutoRepository extends JpaRepository<EntradaSaidaProduto, Long> {
    default Optional<EntradaSaidaProduto> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<EntradaSaidaProduto> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<EntradaSaidaProduto> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct entradaSaidaProduto from EntradaSaidaProduto entradaSaidaProduto left join fetch entradaSaidaProduto.produtoCadastrado",
        countQuery = "select count(distinct entradaSaidaProduto) from EntradaSaidaProduto entradaSaidaProduto"
    )
    Page<EntradaSaidaProduto> findAllWithToOneRelationships(Pageable pageable);

    @Query(
        "select distinct entradaSaidaProduto from EntradaSaidaProduto entradaSaidaProduto left join fetch entradaSaidaProduto.produtoCadastrado"
    )
    List<EntradaSaidaProduto> findAllWithToOneRelationships();

    @Query(
        "select entradaSaidaProduto from EntradaSaidaProduto entradaSaidaProduto left join fetch entradaSaidaProduto.produtoCadastrado where entradaSaidaProduto.id =:id"
    )
    Optional<EntradaSaidaProduto> findOneWithToOneRelationships(@Param("id") Long id);
}
