<?php

namespace App\Models;

use CodeIgniter\Model;

class HistoryUFModel extends Model
{
    protected $table      = 'history_uf';
    protected $primaryKey = 'id';

    protected $useAutoIncrement = true;
    protected $allowedFields = ['value', 'date', 'updated_at'];

    protected $useTimestamps = false;
    protected $createdField = 'created_at';
    protected $updatedField = 'updated_at';
}