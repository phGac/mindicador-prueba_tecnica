<?php

namespace App\Controllers;

use App\Models\HistoryUFModel;

class ApiUF extends BaseController
{
	public function index()
	{
		$History = new HistoryUFModel();
		$history = $History->orderBy('date', 'DESC')->paginate($_GET['length'], 'default', intval($_GET['start']));
		$count = $History->countAllResults();

		echo json_encode([
			"draw" => $_GET['draw'],
			"recordsTotal" => $count,
			"recordsFiltered" => $count,
			'data' => $history,
		]);
	}

	public function create()
	{
		$date = date('Y-m-d', strtotime($_POST['date']));
		$value = $_POST['value'];
		
		$History = new HistoryUFModel();
		$history = $History->where([ 'date' => $date ])->find();

		$success = false; $created_at = time(); $id = null;
		if(! $history) {
			$success = true;
			$History->insert([
				'value' => $value,
				'date' => $date,
			]);
			$id = $History->getInsertID();
		}

		echo json_encode([ 'success' => $success, 'data' => [ 'value' => $value, 'id' => $id, 'created_at' => $created_at ] ]);
	}

	public function update($date)
	{
		echo json_encode([
			'method' => 'update',
			'date' => $date
		]);
	}

	public function destroy($id)
	{
		$History = new HistoryUFModel();
		$History->delete($id);

		echo json_encode([ 'success' => true ]);
	}
}
