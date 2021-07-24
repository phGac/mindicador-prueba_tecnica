<?php

namespace App\Controllers;

use App\Models\HistoryUFModel;

class Maintainer extends BaseController
{
	public function index()
	{
		return view('maintainer/index');
	}

	public function edit($date)
	{
		$date = date('Y-m-d', strtotime($date));

		$History = new HistoryUFModel();
		$history = $History->where('date', $date)->find();

		if(count($history) == 0) {
			return redirect('historicos');
		}

		echo view('maintainer/edit', [ 'date' => $date, 'value' => $history[0]['value'] ]);
	}
}
