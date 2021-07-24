<?php

namespace App\Controllers;

use App\Models\HistoryUFModel;

class ApiUF extends BaseController
{
	public function index()
	{
		$History = new HistoryUFModel();
		$history = $History->orderBy('date', 'DESC')->paginate(10, 'default', 1);
		$count = $History->countAllResults();

		echo json_encode([
			"draw" => 2,
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

		$success = false; $created_at = time();
		if(! $history) {
			$success = true;
			$History->insert([
				'value' => $value,
				'date' => $date,
			]);
		}

		echo json_encode([ 'success' => $success, 'data' => [ 'created_at' => $created_at ] ]);
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
