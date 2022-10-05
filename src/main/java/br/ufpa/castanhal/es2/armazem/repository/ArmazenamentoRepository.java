package br.ufpa.castanhal.es2.armazem.repository;

import br.ufpa.castanhal.es2.armazem.domain.Armazenamento;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Armazenamento entity.
 */
@Repository
public interface ArmazenamentoRepository extends JpaRepository<Armazenamento, Long> {
    default Optional<Armazenamento> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Armazenamento> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Armazenamento> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct armazenamento from Armazenamento armazenamento left join fetch armazenamento.produtoCadastrado",
        countQuery = "select count(distinct armazenamento) from Armazenamento armazenamento"
    )
    Page<Armazenamento> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct armazenamento from Armazenamento armazenamento left join fetch armazenamento.produtoCadastrado")
    List<Armazenamento> findAllWithToOneRelationships();

    @Query(
        "select armazenamento from Armazenamento armazenamento left join fetch armazenamento.produtoCadastrado where armazenamento.id =:id"
    )
    Optional<Armazenamento> findOneWithToOneRelationships(@Param("id") Long id);
}
