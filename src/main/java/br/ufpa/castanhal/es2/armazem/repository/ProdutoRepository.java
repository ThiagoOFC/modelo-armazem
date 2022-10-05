package br.ufpa.castanhal.es2.armazem.repository;

import br.ufpa.castanhal.es2.armazem.domain.Produto;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Produto entity.
 */
@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long> {
    default Optional<Produto> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Produto> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Produto> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct produto from Produto produto left join fetch produto.produtoCadastrado",
        countQuery = "select count(distinct produto) from Produto produto"
    )
    Page<Produto> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct produto from Produto produto left join fetch produto.produtoCadastrado")
    List<Produto> findAllWithToOneRelationships();

    @Query("select produto from Produto produto left join fetch produto.produtoCadastrado where produto.id =:id")
    Optional<Produto> findOneWithToOneRelationships(@Param("id") Long id);
}
