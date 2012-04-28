<?php

/**
 * Views query class using a Search API index as the data source.
 */
class SearchApiMultiViewsQuery extends SearchApiViewsQuery {

  /**
   * The server this view accesses.
   *
   * @var SearchApiServer
   */
  protected $server;

  /**
   * Create the basic query object and fill with default values.
   */
  public function init($base_table, $base_field, array $options) {
    try {
      parent::init($base_table, $base_field, $options);
      if (substr($base_table, 0, 18) == 'search_api_server_') {
        $id = substr($base_table, 18);
        $this->server = search_api_server_load($id);
        $this->query = $this->server->queryMultiple(array(
          'parse mode' => 'terms',
        ));
      }
    }
    catch (Exception $e) {
      $this->errors[] = $e->getMessage();
    }
  }

  /**
   * Helper function for adding results to a view in the format expected by the view.
   */
  protected function addResults(array $results, $view) {
    $index_types = array();
    $view_result = array();
    $items = array();
    $ids = array();
    // First we extract the involved indexes, and which entities need to be
    // loaded for each entity type.
    foreach ($results as $result) {
      $id = $result['id'];
      $index_id = $result['index_id'];
      if (!isset($index_types[$index_id])) {
        $index_types[$index_id] = search_api_index_load($index_id)->item_type;
      }
      // Maybe the service class or a postprocessor already set the entities.
      if (!empty($result['entity'])) {
        $items[$index_types[$index_id]][$id] = $result['entity'];
      }
      else {
        $ids[$index_types[$index_id]][$id] = $id;
      }
    }

    // Then extract the needed fields for each involved entity type.
    $type_fields = array();
    foreach ($this->fields as $field => $true) {
      if (strpos($field, ':') !== FALSE) {
        list($index_id, $field) = explode(':', $field, 2);
        if (isset($index_types[$index_id])) {
          $type_fields[$index_types[$index_id]][$field] = TRUE;
        }
      }
    }

    // Extract the field values for entities that were already loaded.
    foreach ($items as $type => $objs) {
      foreach ($objs as $id => $item) {
        try {
          $key = $type . '-' . $id;
          $wrapper = search_api_get_datasource_controller($type)->getMetadataWrapper($item);
          $view_result[$key] = (object) $this->extractFields($wrapper, $type_fields[$type]);
          $view_result[$key]->entity = $item;
          unset($objs[$id]);
        }
        catch (Exception $e) {
          continue;
        }
      }
      // If the values of some items couldn't be extracted, try it again with
      // freshly loaded ones.
      if ($objs) {
        $ids[$type] = array_merge($ids[$type], array_keys($objs));
      }
    }

    // Load remaining items and extract their field values.
    foreach ($ids as $type => $item_ids) {
      if (empty($type_fields[$type])) {
        continue;
      }
      $datasource = search_api_get_datasource_controller($type);
      $items = $datasource->loadItems($item_ids);
      foreach ($items as $id => $item) {
        try {
          $key = $type . '-' . $id;
          $wrapper = $datasource->getMetadataWrapper($item);
          $view_result[$key] = (object) $this->extractFields($wrapper, $type_fields[$type]);
          $view_result[$key]->entity = $item;
                  }
        catch (Exception $e) {
          continue;
        }
      }
    }

    // Finally, add the extracted values in the correct order to $view->result.
    foreach ($results as $result) {
      $key = $index_types[$result['index_id']] . '-' . $result['id'];
      if (isset($view_result[$key])) {
        $prefix = $result['index_id'] . ':';
        $view->result[$key] = new stdClass();
        foreach ($view_result[$key] as $k => $v) {
          if ($k != 'entity') {
            $k = $prefix . $k;
          }
          $view->result[$key]->$k = $v;
        }
        $view->result[$key]->search_api_relevance = $result['score'];
        $view->result[$key]->search_api_multi_index = $result['index_id'];
        foreach ($this->fields as $field => $true) {
          if (!isset($view->result[$key]->$field)) {
            $view->result[$key]->$field = '';
          }
        }
      }
    }
  }

  //
  // Query interface methods (proxy to $this->query)
  //

  public function getServer() {
    return $this->server;
  }

  public function getIndexes() {
    if (!$this->errors) {
      return $this->query->getIndexes();
    }
  }

}
