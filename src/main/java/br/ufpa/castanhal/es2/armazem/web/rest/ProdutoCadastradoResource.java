package br.ufpa.castanhal.es2.armazem.web.rest;

import br.ufpa.castanhal.es2.armazem.domain.ProdutoCadastrado;
import br.ufpa.castanhal.es2.armazem.repository.ProdutoCadastradoRepository;
import br.ufpa.castanhal.es2.armazem.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link br.ufpa.castanhal.es2.armazem.domain.ProdutoCadastrado}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ProdutoCadastradoResource {

    private final Logger log = LoggerFactory.getLogger(ProdutoCadastradoResource.class);

    private static final String ENTITY_NAME = "produtoCadastrado";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ProdutoCadastradoRepository produtoCadastradoRepository;

    public ProdutoCadastradoResource(ProdutoCadastradoRepository produtoCadastradoRepository) {
        this.produtoCadastradoRepository = produtoCadastradoRepository;
    }

    /**
     * {@code POST  /produto-cadastrados} : Create a new produtoCadastrado.
     *
     * @param produtoCadastrado the produtoCadastrado to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new produtoCadastrado, or with status {@code 400 (Bad Request)} if the produtoCadastrado has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/produto-cadastrados")
    public ResponseEntity<ProdutoCadastrado> createProdutoCadastrado(@RequestBody ProdutoCadastrado produtoCadastrado)
        throws URISyntaxException {
        log.debug("REST request to save ProdutoCadastrado : {}", produtoCadastrado);
        if (produtoCadastrado.getId() != null) {
            throw new BadRequestAlertException("A new produtoCadastrado cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ProdutoCadastrado result = produtoCadastradoRepository.save(produtoCadastrado);
        return ResponseEntity
            .created(new URI("/api/produto-cadastrados/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /produto-cadastrados/:id} : Updates an existing produtoCadastrado.
     *
     * @param id the id of the produtoCadastrado to save.
     * @param produtoCadastrado the produtoCadastrado to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated produtoCadastrado,
     * or with status {@code 400 (Bad Request)} if the produtoCadastrado is not valid,
     * or with status {@code 500 (Internal Server Error)} if the produtoCadastrado couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/produto-cadastrados/{id}")
    public ResponseEntity<ProdutoCadastrado> updateProdutoCadastrado(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ProdutoCadastrado produtoCadastrado
    ) throws URISyntaxException {
        log.debug("REST request to update ProdutoCadastrado : {}, {}", id, produtoCadastrado);
        if (produtoCadastrado.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, produtoCadastrado.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!produtoCadastradoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ProdutoCadastrado result = produtoCadastradoRepository.save(produtoCadastrado);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, produtoCadastrado.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /produto-cadastrados/:id} : Partial updates given fields of an existing produtoCadastrado, field will ignore if it is null
     *
     * @param id the id of the produtoCadastrado to save.
     * @param produtoCadastrado the produtoCadastrado to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated produtoCadastrado,
     * or with status {@code 400 (Bad Request)} if the produtoCadastrado is not valid,
     * or with status {@code 404 (Not Found)} if the produtoCadastrado is not found,
     * or with status {@code 500 (Internal Server Error)} if the produtoCadastrado couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/produto-cadastrados/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ProdutoCadastrado> partialUpdateProdutoCadastrado(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ProdutoCadastrado produtoCadastrado
    ) throws URISyntaxException {
        log.debug("REST request to partial update ProdutoCadastrado partially : {}, {}", id, produtoCadastrado);
        if (produtoCadastrado.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, produtoCadastrado.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!produtoCadastradoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ProdutoCadastrado> result = produtoCadastradoRepository
            .findById(produtoCadastrado.getId())
            .map(existingProdutoCadastrado -> {
                if (produtoCadastrado.getQuando() != null) {
                    existingProdutoCadastrado.setQuando(produtoCadastrado.getQuando());
                }
                if (produtoCadastrado.getLocalArmazenado() != null) {
                    existingProdutoCadastrado.setLocalArmazenado(produtoCadastrado.getLocalArmazenado());
                }

                return existingProdutoCadastrado;
            })
            .map(produtoCadastradoRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, produtoCadastrado.getId().toString())
        );
    }

    /**
     * {@code GET  /produto-cadastrados} : get all the produtoCadastrados.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of produtoCadastrados in body.
     */
    @GetMapping("/produto-cadastrados")
    public List<ProdutoCadastrado> getAllProdutoCadastrados() {
        log.debug("REST request to get all ProdutoCadastrados");
        return produtoCadastradoRepository.findAll();
    }

    /**
     * {@code GET  /produto-cadastrados/:id} : get the "id" produtoCadastrado.
     *
     * @param id the id of the produtoCadastrado to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the produtoCadastrado, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/produto-cadastrados/{id}")
    public ResponseEntity<ProdutoCadastrado> getProdutoCadastrado(@PathVariable Long id) {
        log.debug("REST request to get ProdutoCadastrado : {}", id);
        Optional<ProdutoCadastrado> produtoCadastrado = produtoCadastradoRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(produtoCadastrado);
    }

    /**
     * {@code DELETE  /produto-cadastrados/:id} : delete the "id" produtoCadastrado.
     *
     * @param id the id of the produtoCadastrado to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/produto-cadastrados/{id}")
    public ResponseEntity<Void> deleteProdutoCadastrado(@PathVariable Long id) {
        log.debug("REST request to delete ProdutoCadastrado : {}", id);
        produtoCadastradoRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
